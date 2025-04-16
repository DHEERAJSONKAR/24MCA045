const API_BASE_URL = 'http://20.244.56.144/evaluation-service';

// Enhanced mock data with users, likes, and nested replies
let mockUsers = [
  { id: 1, name: "John Doe", avatar: "https://i.pravatar.cc/150?img=1" },
  { id: 2, name: "Jane Smith", avatar: "https://i.pravatar.cc/150?img=5" },
  { id: 3, name: "Bob Johnson", avatar: "https://i.pravatar.cc/150?img=8" }
];

let currentUser = mockUsers[0]; // Default logged in user

let mockComments = [
  { 
    id: 1, 
    postId: 150, 
    content: "This is a sample comment", 
    userId: 1, 
    user: mockUsers[0],
    createdAt: new Date(Date.now() - 1000000),
    likes: 5,
    dislikes: 1,
    replies: [
      { 
        id: 101, 
        parentId: 1,
        content: "This is a reply to the first comment", 
        userId: 2, 
        user: mockUsers[1],
        createdAt: new Date(Date.now() - 500000),
        likes: 2,
        dislikes: 0
      }
    ]
  },
  { 
    id: 2, 
    postId: 150, 
    content: "React is awesome", 
    userId: 2, 
    user: mockUsers[1],
    createdAt: new Date(Date.now() - 2000000),
    likes: 10,
    dislikes: 0,
    replies: []
  },
  { 
    id: 3, 
    postId: 150, 
    content: "Learning to code is fun", 
    userId: 3, 
    user: mockUsers[2],
    createdAt: new Date(Date.now() - 3000000),
    likes: 7,
    dislikes: 2,
    replies: []
  }
];

let nextId = 4;
let nextReplyId = 102;

export const fetchComments = async (postId = '150', sortBy = 'newest') => {
  try {
    // Try the real API first
    try {
      const response = await fetch(`${API_BASE_URL}/posts/${postId}/comments`, {
        mode: 'cors',
        headers: {
          'Accept': 'application/json',
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Fetched data from API:', data);
        return data || [];
      }
    } catch (apiError) {
      console.warn('API error, falling back to mock data:', apiError);
    }

    // If API fails, use mock data
    console.log('Using mock data');
    let filteredComments = mockComments.filter(
      comment => comment.postId === parseInt(postId)
    );
    
    // Sort comments based on criteria
    switch (sortBy) {
      case 'newest':
        return filteredComments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      case 'oldest':
        return filteredComments.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      case 'likes':
        return filteredComments.sort((a, b) => b.likes - a.likes);
      case 'replies':
        return filteredComments.sort((a, b) => b.replies.length - a.replies.length);
      default:
        return filteredComments;
    }
  } catch (error) {
    console.error('Error in fetchComments:', error);
    return [];
  }
};

export const addComment = async (postId, content) => {
  try {
    // Try the real API first
    try {
      const response = await fetch(`${API_BASE_URL}/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        mode: 'cors',
        body: JSON.stringify({ content }),
      });
      
      if (response.ok) {
        const data = await response.json();
        return data;
      }
    } catch (apiError) {
      console.warn('API error, using mock data instead:', apiError);
    }

    // If API fails, use mock data
    const newComment = { 
      id: nextId++, 
      postId: parseInt(postId), 
      content: content,
      userId: currentUser.id,
      user: currentUser,
      createdAt: new Date(),
      likes: 0,
      dislikes: 0,
      replies: []
    };
    
    mockComments.push(newComment);
    console.log('Added mock comment:', newComment);
    return newComment;
  } catch (error) {
    console.error('Error in addComment:', error);
    throw error;
  }
};

export const addReply = async (commentId, content) => {
  const parentComment = mockComments.find(c => c.id === commentId);
  
  if (!parentComment) {
    throw new Error('Comment not found');
  }
  
  const newReply = {
    id: nextReplyId++,
    parentId: commentId,
    content: content,
    userId: currentUser.id,
    user: currentUser,
    createdAt: new Date(),
    likes: 0,
    dislikes: 0
  };
  
  parentComment.replies.push(newReply);
  return newReply;
};

export const deleteComment = (commentId) => {
  // Remove replies if a parent comment is deleted
  mockComments = mockComments.filter(comment => {
    if (comment.id === commentId) {
      return false; // Remove this comment
    }
    
    // Filter out replies with this commentId as parent
    if (comment.replies) {
      comment.replies = comment.replies.filter(reply => reply.parentId !== commentId);
    }
    
    return true;
  });
  
  return true;
};

export const deleteReply = (commentId, replyId) => {
  const comment = mockComments.find(c => c.id === commentId);
  
  if (comment && comment.replies) {
    comment.replies = comment.replies.filter(reply => reply.id !== replyId);
    return true;
  }
  
  return false;
};

export const likeComment = (commentId) => {
  const comment = mockComments.find(c => c.id === commentId);
  if (comment) {
    comment.likes += 1;
    return comment;
  }
  return null;
};

export const dislikeComment = (commentId) => {
  const comment = mockComments.find(c => c.id === commentId);
  if (comment) {
    comment.dislikes += 1;
    return comment;
  }
  return null;
};

export const likeReply = (commentId, replyId) => {
  const comment = mockComments.find(c => c.id === commentId);
  if (comment) {
    const reply = comment.replies.find(r => r.id === replyId);
    if (reply) {
      reply.likes += 1;
      return reply;
    }
  }
  return null;
};

export const dislikeReply = (commentId, replyId) => {
  const comment = mockComments.find(c => c.id === commentId);
  if (comment) {
    const reply = comment.replies.find(r => r.id === replyId);
    if (reply) {
      reply.dislikes += 1;
      return reply;
    }
  }
  return null;
};

export const getCurrentUser = () => {
  return currentUser;
};

export const switchUser = (userId) => {
  const user = mockUsers.find(u => u.id === userId);
  if (user) {
    currentUser = user;
    return user;
  }
  return currentUser;
};

export const getAllUsers = () => {
  return mockUsers;
};
