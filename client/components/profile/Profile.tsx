import React, {FC, useState} from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

type ProfileProps = {
  user: any;
  fetchUser: Function;
  volume: any;
  click13: any;
  click6: any;
};

const Profile: FC<ProfileProps> = ({user, fetchUser, click13, click6}) => {

  return (
    <div className="text-white min-h-screen h-full flex items-center justify-center pb-5"
      aria-label="User Profile"
    >
      <div className='bg-starfield-light dark:bg-starfield absolute inset-0 z-9'></div>
      <div className="flex flex-col items-center space-y-3 text-center gap-2 relative z-10" aria-labelledby="profile-header">
        <h1 id="profile-header" className="mb-10 text-3xl font-extrabold text-text dark:text-darkText relative z-10">Profile</h1>
        <h2 id='profile-user-name' className='font-bold text-2xl relative z-10 text-text dark:text-darkText' aria-label='Your Name Displayed'>{user.name}</h2>
        <div className="text-text dark:text-darkText relative z-10" aria-label="User image placeholder" style={{scale: '2'}}>👤</div>
        <div className="text-yellow-600 text-bold relative z-10" aria-label={`User score: ${user.score || 0}`}>Score: {user.score || 0}</div>
        <div aria-label="User statistics" className='text-text dark:text-darkText relative z-10'> Wins: {user.wins} | Losses: {user.losses}</div>
        <div className='flex sm:flex-row flex-col gap-4 relative z-10'>
          <div className="w-36 h-36 rounded-full bg-slate-700 z-10 relative">
            <Link
              type="button"
              to="/settings"
              onClick={click13}
              replace={true}
              aria-label="Go to Settings"
              className="absolute inset-0 m-auto w-32 h-32 z-10 bg-neutral dark:bg-slate-800 text-text dark:text-darkText rounded-full shadow-md shadow-slate-200 
              flex items-center justify-center text-xl font-semibold dark:hover:text-text dark:hover:bg-slate-500 hover:bg-slate-500 dark:hover:opacity-100 dark:hover:shadow-slate-300
               hover:shadow-slate-300 hover:blur-[0.5px] dark:hover:blur-[0.5px] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 opacity-75 
               hover:opacity-100"
            >
              Settings
            </Link>
          </div>
          <div className="w-36 h-36 rounded-full z-10 bg-slate-700 relative">
            <Link
              type="button"
              to="/leaderboard"
              onClick={click13}
              replace={true}
              aria-label="Go to Leaderboard"
              className="absolute inset-0 m-auto w-32 z-10 h-32 bg-fourth dark:bg-blue-800 text-text dark:text-darkText rounded-full shadow-md shadow-slate-200 
              flex items-center justify-center text-xl font-semibold dark:hover:bg-blue-500 hover:bg-yellow-500 dark:hover:opacity-100 dark:hover:shadow-blue-300 hover:shadow-yellow-300
              hover:blur-[0.5px] dark:hover:blur-[0.5px] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 opacity-75 hover:opacity-100"
            >
             Leaderboard
            </Link>
          </div>
          <div className="w-36 h-36 rounded-full bg-slate-700 z-10 relative">
            <Link
              type="button"
              onClick={click13}
              to="/friends"
              replace={true}
              aria-label="Go to Friends"
              className="absolute inset-0 m-auto w-32 h-32 z-10 dark:bg-third bg-fifth text-text dark:text-darkText rounded-full shadow-md shadow-slate-200 flex 
              items-center justify-center text-xl font-semibold dark:hover:bg-purple-900 hover:bg-orange-500 dark:hover:opacity-100 dark:hover:shadow-purple-700
              hover:shadow-orange-300 hover:blur-[0.5px] dark:hover:blur-[0.5px] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 opacity-75 
              hover:opacity-100"
            >
              Friends
            </Link>
          </div>
          <div className="w-36 h-36 rounded-full z-10 bg-slate-700 relative">
            <Link
              type="button"
              onClick={click13}
              to="/cards"
              replace={true}
              aria-label="Go to Cards"
              className="absolute inset-0 m-auto z-10 w-32 h-32 dark:bg-darkGreen bg-success text-text dark:text-darkText rounded-full shadow-md shadow-slate-200
               flex items-center justify-center text-xl font-semibold dark:hover:bg-green-500 hover:bg-green-500 dark:hover:opacity-100 dark:hover:shadow-green-300 hover:shadow-green-300 
               hover:blur-[0.5px] dark:hover:blur-[0.5px] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 opacity-75 hover:opacity-100"
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