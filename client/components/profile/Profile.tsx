import React, {FC, useState} from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

type ProfileProps = {
  user: any;
  fetchUser: Function;
};

const Profile: FC<ProfileProps> = ({user, fetchUser}) => {

  return (
    <div className="bg-radial-custom dark:text-white text-white min-h-screen h-full flex items-center justify-center pb-5"
      aria-label="User Profile"
    >
      <div className="flex flex-col items-center space-y-3 text-center gap-2" aria-labelledby="profile-header">
        <h1 id="profile-header" className="mb-10 text-3xl font-extrabold">Profile</h1>
        <h2 id='profile-user-name' className='font-bold text-2xl' aria-label='Your Name Displayed'>{user.name}</h2>
        <div className="" aria-label="User image placeholder">Image</div>
        <div className="text-yellow-300 text-bold" aria-label={`User score: ${user.score || 0}`}>Score: {user.score || 0}</div>
        <div aria-label="User statistics"> Wins: {user.wins} | Losses: {user.losses}</div>
        <Link
          type="button"
          className="w-96 py-6 text-2xl p-3 bg-third text-text rounded-lg shadow-md shadow-slate-600 hover:bg-indigo-500"
          to="/cards"
          replace={true}
          aria-label="Go to Cards"
        >
          Cards
        </Link>
        <Link
          type="button"
          className="w-96 py-6 text-2xl p-3 bg-emerald-500 text-text rounded-lg shadow-md shadow-slate-600 hover:bg-emerald-400"
          to="/friends"
          replace={true}
          aria-label="Go to Friends"
        >
          Friends
        </Link>
        <Link
          type="button"
          className="w-96 py-6 text-2xl p-3 bg-gray text-text rounded-lg shadow-md shadow-slate-600 hover:bg-slate-300"
          to="/settings"
          replace={true}
          aria-label="Go to Settings"
        >
          Settings
        </Link>
        <Link
          type="button"
          className="w-96 py-6 text-2xl p-3 text-text rounded-lg shadow-md shadow-slate-600 hover:bg-yellow-600 bg-yellow-400"
          to="/leaderboard"
          replace={true}
          aria-label="Go to Leaderboard"
        >
          Leaderboard
        </Link>
      </div>
    </div>
  );
}

export default Profile;