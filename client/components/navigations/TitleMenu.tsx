import React, { FC } from 'react';
import {Link} from 'react-router-dom';
import LeaderBoard from '../leaderboard/Leaderboard';

type TitleProps = {
  user: Object | null;
  playFireSFX: () => void;
};

const TitleMenu: FC<TitleProps> = ({user, playFireSFX}) => {


  return (
    <div className="flex items-center justify-center min-h-screen h-screen max-h-screen text-text dark:text-darkText flex-col" aria-label="Title Menu">
      <div className="flex flex-row text-center space-between gap-3">
        <div className='bg-starfield-light dark:bg-starfield absolute inset-0 z-9'></div>
        {/* How To Play Button Container */}
        <div className="w-28 h-28 rounded-full bg-slate-700 relative">
          <button 
            value='Fire'
            className="absolute inset-0 z-10 m-auto w-24 h-24 dark:bg-third bg-fifth text-text dark:text-darkText rounded-full shadow-md shadow-slate-200 flex items-center justify-center text-xl font-semibold dark:hover:bg-slate-300 hover:bg-slate-300"
           onClick={playFireSFX}></button>
        </div>
        <div className="w-28 h-28 rounded-full bg-slate-700 relative">
          <Link
            to="/instructions"
            replace={true}
            className="absolute inset-0 z-10 m-auto w-24 h-24 dark:bg-third bg-fifth text-text dark:text-darkText rounded-full shadow-md shadow-slate-200 flex items-center justify-center text-xl font-semibold dark:hover:bg-slate-300 hover:bg-slate-300"
          >
            How To Play
          </Link>
        </div>
        {/* Profile Button Container */}
        <div className="w-28 h-28 z-10 rounded-full bg-slate-700 relative">
          <Link
            to="/user-profile"
            replace={true}
            className="absolute inset-0 z-10 m-auto w-24 h-24 bg-neutral text-text dark:text-darkText rounded-full shadow-md shadow-slate-200 flex items-center justify-center text-xl font-semibold dark:hover:bg-slate-300 hover:bg-slate-300"
          >
            Profile
          </Link>
        </div>
        {/* Play Button Container */}
        <div className="w-28 h-28 rounded-full bg-slate-700 z-10 relative">
          <Link
            to="/game-board"
            replace={true}
            className="absolute inset-0 z-10 m-auto w-24 h-24 bg-success dark:bg-darkGreen text-text dark:text-darkText rounded-full shadow-md shadow-slate-200 flex items-center justify-center text-xl font-semibold dark:hover:bg-slate-300 hover:animate-pulse"

          >
            Play!
          </Link>
        </div>
      </div>
      <div className="pt-20 relative z-10 grid sm:grid grid-col-1">
        <LeaderBoard user={user} fullScreen={false} />
      </div>
    </div>
  );
};

export default TitleMenu;