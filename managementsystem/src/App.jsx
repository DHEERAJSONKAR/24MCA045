import { useState, useEffect } from 'react'
import './App.css'
import { 
  fetchComments, 
  addComment, 
  deleteComment, 
  likeComment, 
  dislikeComment,
  addReply,
  deleteReply,
  likeReply,
  dislikeReply,
  getCurrentUser,
  switchUser,
  getAllUsers
} from './services/api'
import Comment from './components/Comment';
import { format } from 'date-fns';
import UserSelector from './components/UserSelector';

function App() {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterText, setFilterText] = useState('');
  const [commentContent, setCommentContent] = useState('');
  const [postId, setPostId] = useState('150');
  const [sortOption, setSortOption] = useState('newest');
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    setCurrentUser(getCurrentUser());
    setUsers(getAllUsers());
    loadComments();
  }, []);

  const loadComments = async () => {
    setLoading(true);
    try {
      const data = await fetchComments(postId, sortOption);
      setComments(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Failed to load comments. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComments();
  }, [sortOption, postId]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentContent.trim()) return;
    
    try {
      setLoading(true);
      const newComment = await addComment(postId, commentContent);
      setComments(prevComments => [newComment, ...prevComments]);
      setCommentContent('');
    } catch (err) {
      setError('Failed to add comment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(commentId);
      setComments(prevComments => 
        prevComments.filter(comment => comment.id !== commentId)
      );
    } catch (err) {
      setError('Failed to delete comment. Please try again.');
    }
  };

  const handleLikeComment = async (commentId) => {
    try {
      await likeComment(commentId);
      setComments(prevComments => 
        prevComments.map(comment => 
          comment.id === commentId 
            ? { ...comment, likes: comment.likes + 1 } 
            : comment
        )
      );
    } catch (err) {
      setError('Failed to like comment. Please try again.');
    }
  };

  const handleDislikeComment = async (commentId) => {
    try {
      await dislikeComment(commentId);
      setComments(prevComments => 
        prevComments.map(comment => 
          comment.id === commentId 
            ? { ...comment, dislikes: comment.dislikes + 1 } 
            : comment
        )
      );
    } catch (err) {
      setError('Failed to dislike comment. Please try again.');
    }
  };

  const handleAddReply = async (commentId, content) => {
    try {
      const newReply = await addReply(commentId, content);
      setComments(prevComments => 
        prevComments.map(comment => 
          comment.id === commentId 
            ? { ...comment, replies: [...comment.replies, newReply] } 
            : comment
        )
      );
    } catch (err) {
      setError('Failed to add reply. Please try again.');
    }
  };

  const handleDeleteReply = async (commentId, replyId) => {
    try {
      await deleteReply(commentId, replyId);
      setComments(prevComments => 
        prevComments.map(comment => 
          comment.id === commentId 
            ? { 
                ...comment, 
                replies: comment.replies.filter(reply => reply.id !== replyId) 
              } 
            : comment
        )
      );
    } catch (err) {
      setError('Failed to delete reply. Please try again.');
    }
  };

  const handleLikeReply = async (commentId, replyId) => {
    try {
      await likeReply(commentId, replyId);
      setComments(prevComments => 
        prevComments.map(comment => 
          comment.id === commentId 
            ? { 
                ...comment, 
                replies: comment.replies.map(reply => 
                  reply.id === replyId 
                    ? { ...reply, likes: reply.likes + 1 } 
                    : reply
                ) 
              } 
            : comment
        )
      );
    } catch (err) {
      setError('Failed to like reply. Please try again.');
    }
  };

  const handleDislikeReply = async (commentId, replyId) => {
    try {
      await dislikeReply(commentId, replyId);
      setComments(prevComments => 
        prevComments.map(comment => 
          comment.id === commentId 
            ? { 
                ...comment, 
                replies: comment.replies.map(reply => 
                  reply.id === replyId 
                    ? { ...reply, dislikes: reply.dislikes + 1 } 
                    : reply
                ) 
              } 
            : comment
        )
      );
    } catch (err) {
      setError('Failed to dislike reply. Please try again.');
    }
  };

  const handleUserSwitch = (userId) => {
    const newUser = switchUser(userId);
    setCurrentUser(newUser);
  };

  const filteredComments = comments.filter(comment => 
    comment.content?.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-3xl font-bold text-center mb-8">Enhanced Comment System</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {currentUser && (
        <UserSelector 
          users={users}
          currentUser={currentUser}
          onSelectUser={handleUserSwitch}
        />
      )}
      
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div className="w-1/2">
            <label htmlFor="postId" className="block mb-1 text-sm font-medium">Post ID</label>
            <div className="flex">
              <input
                type="text"
                id="postId"
                value={postId}
                onChange={(e) => setPostId(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-l"
              />
              <button 
                onClick={loadComments}
                className="px-4 py-2 bg-blue-500 text-white rounded-r hover:bg-blue-600"
              >
                Load
              </button>
            </div>
          </div>
          <div className="w-1/2 ml-4">
            <label htmlFor="sortOption" className="block mb-1 text-sm font-medium">Sort By</label>
            <select
              id="sortOption"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="likes">Most Likes</option>
              <option value="replies">Most Replies</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <label htmlFor="filterText" className="block mb-1 text-sm font-medium">Filter Comments</label>
        <input
          type="text"
          id="filterText"
          placeholder="Type to filter comments..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      
      <div className="mb-8 p-4 bg-gray-50 border rounded">
        <div className="flex items-start space-x-3">
          {currentUser && currentUser.avatar && (
            <img 
              src={currentUser.avatar} 
              alt={currentUser.name} 
              className="w-10 h-10 rounded-full"
            />
          )}
          <div className="flex-1">
            <form onSubmit={handleAddComment}>
              <textarea
                id="content"
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                rows="3"
                placeholder="Add a comment..."
                required
              />
              <div className="mt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Posting...' : 'Post Comment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      
      <h2 className="text-xl font-bold mb-4">Comments ({filteredComments.length})</h2>
      
      {loading && !comments.length ? (
        <div className="flex justify-center my-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : filteredComments.length === 0 ? (
        <p className="my-4 text-gray-500">No comments match your filter</p>
      ) : (
        <div className="space-y-1">
          {filteredComments.map((comment) => (
            <Comment 
              key={comment.id}
              comment={comment}
              onDelete={handleDeleteComment}
              onLike={handleLikeComment}
              onDislike={handleDislikeComment}
              onAddReply={handleAddReply}
              onDeleteReply={handleDeleteReply}
              onLikeReply={handleLikeReply}
              onDislikeReply={handleDislikeReply}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default App
