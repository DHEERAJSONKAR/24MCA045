import React from 'react';

function UserSelector({ users, currentUser, onSelectUser }) {
  return (
    <div className="mb-6 p-4 bg-gray-100 rounded-md border">
      <h2 className="text-lg font-semibold mb-3">Switch User</h2>
      <div className="flex flex-wrap gap-2">
        {users.map(user => (
          <button
            key={user.id}
            onClick={() => onSelectUser(user.id)}
            className={`flex items-center p-2 rounded-full ${
              currentUser.id === user.id ? 'ring-2 ring-blue-500' : ''
            }`}
          >
            <img 
              src={user.avatar} 
              alt={user.name} 
              className="w-10 h-10 rounded-full"
            />
            <span className={`ml-2 ${currentUser.id === user.id ? 'font-bold' : ''}`}>
              {user.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default UserSelector;
