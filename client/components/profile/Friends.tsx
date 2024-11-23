import React from 'react';
import {Link} from 'react-router-dom';

const Friends = () => {
  const friends = [
    { name: 'Jeremy', wins: 0, losses: 0, totalGames: 0 },
    { name: 'Ben', wins: 0, losses: 0, totalGames: 0 },
    { name: 'Justin', wins: 0, losses: 0, totalGames: 0},
  ];

  return (
    <div className="pt-10 flex flex-col items-center bg-gray-800 p-6 rounded-lg shadow-md h-screen sm:grid-cols-1">
      <div>
      </div>
      <h1 className="text-2xl font-bold text-white mb-4">FRIENDS</h1>
      <div className="w-full max-w-md">
        <ul className="divide-y divide-gray-600 space-y-1 overflow-y-auto">
          {friends.map((friend, index) => (
            <li
              key={index}
              className="flex justify-between items-center py-4 px-6 bg-gray-700 rounded-md hover:bg-gray-600 transition-colors"
            >
              <button className='text-green-500 hover:text-green-700'>+</button>
              <span className="text-white font-medium">{friend.name}</span>
              <div className="flex flex-col items-center justify-center">
                <span className="text-sm text-green-400">Wins: {friend.wins}</span>
                <span className="text-sm text-red-400">Losses: {friend.losses}</span>
                <span className="text-sm text-slate-500">Total Games: {friend.totalGames}</span>

              </div>
              <button className='text-red-400 text-4xl align-center- justify-center hover:text-red-700'>-</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Friends;
