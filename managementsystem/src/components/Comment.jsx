import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import Reply from './Reply';

function Comment({ comment, onDelete, onLike, onDislike, onAddReply, onDeleteReply, onLikeReply, onDislikeReply }) {
  const [showReplies, setShowReplies] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [isReplying, setIsReplying] = useState(false);

  const handleReplySubmit = (e) => {
    e.preventDefault();
    if (!replyContent.trim()) return;
    
    onAddReply(comment.id, replyContent);
    setReplyContent('');
    setIsReplying(false);
    setShowReplies(true); // Show replies after adding one
  };

  const toggleReplies = () => {
    setShowReplies(!showReplies);
  };

  return (
    <div className="p-4 bg-white border rounded shadow-sm mb-4">
      <div className="flex items-start space-x-3">
        {comment.user && comment.user.avatar && (
          <img 
            src={comment.user.avatar} 
            alt={comment.user.name} 
            className="w-10 h-10 rounded-full"
          />
        )}
        
        <div className="flex-1">
          <div className="flex justify-between items-center">
            <h3 className="font-medium text-gray-900">
              {comment.user ? comment.user.name : 'Anonymous'}
            </h3>
            <span className="text-sm text-gray-500">
              {comment.createdAt && formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
            </span>
          </div>
          
          <p className="mt-1 text-gray-800">{comment.content}</p>
          
          <div className="mt-2 flex items-center space-x-4">
            <button 
              onClick={() => onLike(comment.id)}
              className="flex items-center text-sm text-gray-500 hover:text-blue-500"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"></path>
              </svg>
              {comment.likes}
            </button>
            
            <button 
              onClick={() => onDislike(comment.id)}
              className="flex items-center text-sm text-gray-500 hover:text-red-500"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.095c.5 0 .905-.405.905-.905 0-.714.211-1.412.608-2.006L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5"></path>
              </svg>
              {comment.dislikes}
            </button>
            
            <button 
              onClick={() => setIsReplying(!isReplying)}
              className="flex items-center text-sm text-gray-500 hover:text-green-500"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"></path>
              </svg>
              Reply
            </button>
            
            {comment.replies && comment.replies.length > 0 && (
              <button 
                onClick={toggleReplies}
                className="flex items-center text-sm text-gray-500 hover:text-purple-500"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
                {showReplies ? 'Hide' : 'Show'} {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}
              </button>
            )}
            
            <button 
              onClick={() => onDelete(comment.id)}
              className="flex items-center text-sm text-gray-500 hover:text-red-500 ml-auto"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
              Delete
            </button>
          </div>
        </div>
      </div>
      
      {isReplying && (
        <form onSubmit={handleReplySubmit} className="mt-3 ml-12">
          <textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            rows="2"
            placeholder="Write a reply..."
            required
          />
          <div className="mt-2 flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setIsReplying(false)}
              className="px-3 py-1 text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1 text-sm text-white bg-blue-600 rounded hover:bg-blue-700"
            >
              Reply
            </button>
          </div>
        </form>
      )}
      
      {showReplies && comment.replies && comment.replies.length > 0 && (
        <div className="ml-12 mt-3 space-y-3">
          {comment.replies.map(reply => (
            <Reply 
              key={reply.id}
              reply={reply}
              commentId={comment.id}
              onDelete={onDeleteReply}
              onLike={onLikeReply}
              onDislike={onDislikeReply}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Comment;
