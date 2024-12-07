import React, {FC, useState} from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

type ProfileProps = {
  user: any;
  fetchUser: Function;
};

const Profile: FC<ProfileProps> = ({user, fetchUser}) => {

  return (
    <div className="bg-starfield dark:text-white text-text min-h-screen h-full flex items-center justify-center pb-5"
      aria-label="User Profile"
    >
      <div className="flex flex-col items-center space-y-3 text-center gap-2" aria-labelledby="profile-header">
        <h1 id="profile-header" className="mb-10 text-3xl font-extrabold">Profile</h1>
        <h2 id='profile-user-name' className='font-bold text-2xl' aria-label='Your Name Displayed'>{user.name}</h2>
        <div className="" aria-label="User image placeholder">Image</div>
        <div className="text-yellow-300 text-bold" aria-label={`User score: ${user.score || 0}`}>Score: {user.score || 0}</div>
        <div aria-label="User statistics"> Wins: {user.wins} | Losses: {user.losses}</div>
        <div className='flex flex-row gap-4'>
        <div className="w-36 h-36 rounded-full bg-slate-700 relative">
            <Link
              type="button"
              to="/settings"
              replace={true}
              aria-label="Go to Settings"
              className="absolute inset-0 m-auto w-32 h-32 bg-neutral dark:bg-slate-800 text-text rounded-full shadow-md shadow-slate-200 flex items-center justify-center text-xl font-semibold dark:hover:bg-slate-300 hover:bg-slate-300"
            >
              Settings
            </Link>
          </div>
          <div className="w-36 h-36 rounded-full bg-slate-700 relative">
            <Link
              type="button"
              to="/leaderboard"
              replace={true}
              aria-label="Go to Leaderboard"
              className="absolute inset-0 m-auto w-32 h-32 bg-fourth dark:bg-blue-800 text-text rounded-full shadow-md shadow-slate-200 flex items-center justify-center text-xl font-semibold dark:hover:bg-slate-300 hover:bg-slate-300"
            >
             Leaderboard
            </Link>
          </div>
          <div className="w-36 h-36 rounded-full bg-slate-700 relative">
            <Link
              type="button"
              to="/friends"
              replace={true}
              aria-label="Go to Friends"
              className="absolute inset-0 m-auto w-32 h-32 dark:bg-third bg-fifth text-text rounded-full shadow-md shadow-slate-200 flex items-center justify-center text-xl font-semibold dark:hover:bg-slate-300 hover:bg-slate-300"
            >
              Friends
            </Link>
          </div>
          <div className="w-36 h-36 rounded-full bg-slate-700 relative">
            <Link
              type="button"
              to="/cards"
              replace={true}
              aria-label="Go to Cards"
              className="absolute inset-0 m-auto w-32 h-32 dark:bg-darkGreen bg-success text-text rounded-full shadow-md shadow-slate-200 flex items-center justify-center text-xl font-semibold dark:hover:bg-slate-300 hover:bg-slate-300"
            >
              Cards
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;