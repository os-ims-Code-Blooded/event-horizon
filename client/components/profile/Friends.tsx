import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios'
type FriendsProp = {
  user: any;
  friends: any;
  handleInvite: any;
}
const Friends = ({ user, friends, handleInvite }: FriendsProp) => {
  const [selectedFriendId, setSelectedFriendId] = useState<string | null>(null);

  const handleSelectFriend = (friendId: string) => {
    setSelectedFriendId((prev) => (prev === friendId ? null : friendId));
  };

  return (
    <div className="pt-10 flex flex-col items-center bg-gray-800 p-6 rounded-lg shadow-md h-screen sm:grid-cols-1">
      <h1 className="text-2xl font-bold text-white mb-4">FRIENDS</h1>
      <div className="w-full max-w-md">
        <ul className="divide-y divide-gray-600 space-y-1 overflow-y-auto">
          {friends.map((friend: any) => (
            <li
              key={friend.id}
              className={`flex justify-between items-center py-4 px-6 rounded-md transition-colors cursor-pointer ${
                selectedFriendId === friend.id
                  ? 'bg-blue-700 text-white'
                  : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
              }`}
              onClick={() => handleSelectFriend(friend.id)}
            >
              <span className="font-medium">{friend.email}</span>
              <div className="flex flex-col items-center justify-center">
                <span className="text-sm text-green-400">Wins: {friend.wins || 0}</span>
                <span className="text-sm text-red-400">Losses: {friend.losses || 0}</span>
                <span className="text-sm text-slate-500">Total Games: {friend.totalGames || 0}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <button
        className={`mt-4 px-4 py-2 rounded text-white ${
          selectedFriendId
            ? 'bg-blue-500 hover:bg-blue-600'
            : 'bg-gray-500 cursor-not-allowed'
        }`}
        onClick={() => selectedFriendId && handleInvite(selectedFriendId)}
        disabled={!selectedFriendId}
      >
        Invite to Play
      </button>
    </div>
  );
};

export default Friends;