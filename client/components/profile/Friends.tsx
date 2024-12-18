import React, { useState } from 'react';
import axios from 'axios';

type FriendsProp = {
  user: any;
  friends: any[];
  handleInvite: (friendId: number) => void;
  handleAddFriend: (friendId: number) => void;
  fetchUser: Function;
  getFriends: Function;
  volume: any;
};

const Friends = ({ user, getFriends, friends, handleInvite, handleAddFriend }: FriendsProp) => {
  const [selectedFriendId, setSelectedFriendId] = useState<number | null>(null);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showDeletePrompt, setShowDeletePrompt] = useState(false);

  const handleSelectFriend = (friendId: number) => {
    setSelectedFriendId((prev) => (prev === friendId ? null : friendId));
  };

  const handleSearch = async () => {
    if (searchQuery.trim()) {
      try {
        const response = await axios.get(`/profile/users/search`, {
          params: { name: searchQuery },
        });
        setSearchResults(response.data);
      } catch (error) {
        console.error('Error searching for users');
        setSearchResults([]);
      }
    }
  };

  const toggleSearch = () => {
    setShowSearch((prev) => !prev);
    setSearchQuery('');
    setSearchResults([]);
    setSelectedFriendId(null);
  };

  const handleAddFriendClick = async (friendId: number) => {
    try {
      await handleAddFriend(friendId);
      setSelectedFriendId(null);
      setShowSearch(false);
    } catch (error) {
      console.error('Error adding friend:', error);
    }
  };

  const promptDelete = (friendId: number) => {
    setSelectedFriendId(friendId);
    setShowDeletePrompt(true);
  };

  const confirmDelete = async () => {
    try {
      if (selectedFriendId) {
        const deletedFriend = await axios.delete(`/friends/${user.id}`, {
          data: { id: selectedFriendId },
        });
        if (deletedFriend.status === 204) {
          getFriends();
          setSelectedFriendId(null);
          setShowDeletePrompt(false);
        }
      }
    } catch (error) {
      console.error('Failed to delete friend');
    }
  };

  const cancelDelete = () => {
    setSelectedFriendId(null);
    setShowDeletePrompt(false);
  };

  const currentList = showSearch ? searchResults : friends;

  return (
    <div
      className="pt-10 flex flex-col items-center bg-starfield-light dark:bg-starfield p-6 rounded-lg shadow-md h-screen sm:grid-cols-1"
      aria-label="Friends or Search Results"
    >
      <h1 className="text-2xl font-bold text-text dark:text-darkText mb-4 pt-5">
        {showSearch ? 'Search Results' : "Your Friend's List"}
      </h1>

      {showSearch && (
        <div className="w-full max-w-md mb-4">
          <input
            type="text"
            placeholder="Search for users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 rounded bg-slate-500 dark:bg-slate-600 text-text placeholder-text dark:placeholder-darkText dark:text-darkText text-center focus:outline-none focus:ring-2 focus:ring-yellow-500"
            aria-label="Search input"
          />
          <button
            onClick={handleSearch}
            className="mt-2 w-full px-4 py-2 rounded bg-yellow-500 text-text dark:text-darkText hover:bg-yellow-300 dark:hover:bg-yellow-600"
          >
            Search
          </button>
        </div>
      )}

      <div className="w-full max-w-md overflow-y">
        <ul className="divide-y divide-slate-600 space-y-1 overflow-y-auto">
          {currentList.map((friend: any) => (
            <li
              key={friend.id}
              className={`flex justify-between items-center py-4 px-6 rounded-md transition-colors cursor-pointer ${
                selectedFriendId === friend.id
                  ? 'bg-blue-700 text-white'
                  : 'bg-slate-600 text-white hover:bg-slate-500 '
              }`}
              onClick={() => handleSelectFriend(friend.id)}
              aria-label={`Friend ${friend.name}`}
            >
              <button
                className="font-red hover:bg-slate-300"
                onClick={(e) => {
                  e.stopPropagation();
                  promptDelete(friend.id);
                }}
                aria-label={`Delete friend ${friend.name}`}
              >
                {currentList === friends ? <div>💥</div> : ''}
              </button>
              <span className="font-medium">{friend.name}</span>
              {!showSearch && (
                <div className="flex flex-col items-center justify-center">
                  <span className="text-sm text-green-400">Wins: {friend.wins || 0}</span>
                  <span className="text-sm text-error">Losses: {friend.losses || 0}</span>
                  <span className="text-sm text-yellow-600">Score: {friend.score || 0}</span>
                </div>
              )}
              {showSearch && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddFriendClick(friend.id);
                  }}
                  className="ml-4 px-3 py-1 bg-green-500 text-text rounded hover:bg-green-600"
                  aria-label={`Add friend ${friend.name || friend.email}`}
                >
                  Add Friend
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4 flex gap-4">
        <button
          onClick={toggleSearch}
          className={`px-4 py-2 rounded ${
            showSearch ? 'bg-slate-500 text-text dark:text-darkText hover:bg-slate-400' : 'bg-blue-500 text-text dark:text-darkText hover:bg-blue-600'
          } text-text`}
          aria-label={showSearch ? 'Back to Friends' : 'Find a New Friend'}
        >
          {showSearch ? 'Back to Friends' : 'Find a New Friend'}
        </button>
        <button
          className={`px-4 py-2 rounded dark:text-darkText text-text ${
            selectedFriendId
              ? 'bg-yellow-600 hover:bg-yellow-400'
              : 'bg-slate-500 cursor-not-allowed'
          }`}
          onClick={() => {
            selectedFriendId && handleInvite(selectedFriendId);
            setSelectedFriendId(null);
          }}
          disabled={!selectedFriendId}
          aria-label="Invite to play"
        >
          Invite to Play
        </button>
      </div>

      {showDeletePrompt && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="p-4 bg-slate-700 rounded shadow-lg w-full max-w-sm">
            <h2 className="text-lg font-bold mb-2">Confirm Deletion</h2>
            <p className="text-sm text-slate-600">
              Are you sure you want to delete this friend?
            </p>
            <div className="flex justify-end gap-4 mt-4">
              <button
                className="px-4 py-2 bg-slate-300 text-slate-700 rounded hover:bg-slate-400"
                onClick={cancelDelete}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-error text-white rounded hover:bg-text"
                onClick={confirmDelete}
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Friends;
