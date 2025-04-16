import { useState } from 'react';

function CommentList({ comments, onDelete }) {
  const [filterText, setFilterText] = useState('');
  
  const filteredComments = comments.filter(comment => 
    comment.content.toLowerCase().includes(filterText.toLowerCase())
  );
  
  return (
    <div className="mt-6">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Filter comments..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      
      <h2 className="text-xl font-bold mb-4">Comments ({filteredComments.length})</h2>
      
      {filteredComments.length === 0 ? (
        <p className="text-gray-500">No comments match your filter</p>
      ) : (
        <ul className="space-y-4">
          {filteredComments.map((comment) => (
            <li key={comment.id} className="p-4 bg-white border rounded shadow-sm">
              <div className="flex justify-between">
                <p className="font-medium">Comment ID: {comment.id}</p>
                <p className="text-gray-500">Post ID: {comment.postId}</p>
              </div>
              <p className="mt-2">{comment.content}</p>
              <button 
                onClick={() => onDelete(comment.id)}
                className="mt-2 px-3 py-1 text-sm text-red-600 border border-red-600 rounded hover:bg-red-50"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CommentList;
