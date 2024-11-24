import React, {FC, useState} from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

type ProfileProps = {
  user: any;

};

const Profile: FC<ProfileProps> = ({user}) => {
  const [name, setName] = useState(user.name || '');
  const [isEditing, setIsEditing] = useState(false);

  const changeName = async () => {
    axios.patch(`/profile/${user.id}`, {name})
      .then((nameChanged) => {
        if(!nameChanged) {
          console.error('failed to change user name');
        } else {
          setIsEditing(false);
          console.log('nameChanged!', nameChanged);
        }
      })
      .catch((err) => {
        console.error('Failed to send name change request');
      })
  };

  return (
    <div className="bg-slate-800 dark:bg-black dark:text-white text-slate-400 min-h-screen h-full flex items-center justify-center pb-5">
      <div className="flex flex-col items-center space-y-3 text-center">
        <h1 className="mb-10">Profile</h1>

        {isEditing ? (
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            />
            <button
              onClick={changeName}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        ) : (
          <div
            className="p-2 anime-pulse border rounded focus:outline-none text-white cursor-pointer hover:border-blue-500"
            onClick={() => setIsEditing(true)}
          >
            {name}
          </div>
        )}

        <div className="">Image</div>
        <div className="text-yellow-300 text-bold">Score: {user.score || 0}</div>
        <div> Wins: 0 | Losses: 0</div>
        <Link
          type="button"
          className="w-96 py-6 text-2xl p-3 bg-blue-500 text-white rounded-lg shadow-md shadow-slate-600 hover:bg-blue-600"
          to="cards"
        >
          Cards
        </Link>
        <Link
          type="button"
          className="w-96 py-6 text-2xl p-3 bg-green-500 text-white rounded-lg shadow-md shadow-slate-600 hover:bg-blue-600"
          to="/friends"
          replace={true}
        >
          Friends
        </Link>
        <Link
          type="button"
          className="w-96 py-6 text-2xl p-3 bg-gray-500 text-white rounded-lg shadow-md shadow-slate-600 hover:bg-blue-600"
          to=""
        >
          Settings
        </Link>
        <Link
          type="button"
          className="w-96 py-6 text-2xl p-3 bg-orange-400 text-white rounded-lg shadow-md shadow-slate-600 hover:bg-blue-600"
          to="customize"
        >
          Customize
        </Link>
      </div>
    </div>
  );
}

export default Profile;