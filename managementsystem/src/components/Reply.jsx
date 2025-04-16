import React from 'react';
import { formatDistanceToNow } from 'date-fns';

function Reply({ reply, commentId, onDelete, onLike, onDislike }) {
  return (
    <div className="p-3 bg-gray-50 border rounded-md">
      <div className="flex items-start space-x-3">
        {reply.user && reply.user.avatar && (
          <img 
            src={reply.user.avatar} 
            alt={reply.user.name} 
            className="w-8 h-8 rounded-full"
          />
        )}
        
        <div className="flex-1">
          <div className="flex justify-between items-center">
            <h4 className="font-medium text-gray-900 text-sm">
              {reply.user ? reply.user.name : 'Anonymous'}
            </h4>
            <span className="text-xs text-gray-500">
              {reply.createdAt && formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true })}
            </span>
          </div>
          
          <p className="mt-1 text-sm text-gray-800">{reply.content}</p>
          
          <div className="mt-2 flex items-center space-x-4">
            <button 
              onClick={() => onLike(commentId, reply.id)}
              className="flex items-center text-xs text-gray-500 hover:text-blue-500"
            >
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"></path>
              </svg>
              {reply.likes}
            </button>
            
            <button 
              onClick={() => onDislike(commentId, reply.id)}
              className="flex items-center text-xs text-gray-500 hover:text-red-500"
            >
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.095c.5 0 .905-.405.905-.905 0-.714.211-1.412.608-2.006L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5"></path>
              </svg>
              {reply.dislikes}
            </button>
            
            <button 
              onClick={() => onDelete(commentId, reply.id)}
              className="flex items-center text-xs text-gray-500 hover:text-red-500 ml-auto"
            >
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Reply;
