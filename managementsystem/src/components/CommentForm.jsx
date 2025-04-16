import { useState } from 'react';

function CommentForm({ onSubmit, postId }) {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentPostId, setCurrentPostId] = useState(postId || '150');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    
    setIsSubmitting(true);
    try {
      await onSubmit(currentPostId, content);
      setContent('');
    } catch (error) {
      // Error handling is managed by the parent component
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="mt-8 p-4 bg-gray-50 border rounded">
      <h2 className="text-xl font-bold mb-4">Add New Comment</h2>
      
      <div className="mb-4">
        <label htmlFor="postId" className="block mb-1 font-medium">Post ID</label>
        <input
          type="text"
          id="postId"
          value={currentPostId}
          onChange={(e) => setCurrentPostId(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
      </div>
      
      <div className="mb-4">
        <label htmlFor="content" className="block mb-1 font-medium">Comment</label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
          rows="3"
          required
        />
      </div>
      
      <button
        type="submit"
        disabled={isSubmitting}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {isSubmitting ? 'Adding...' : 'Add Comment'}
      </button>
    </form>
  );
}

export default CommentForm;
