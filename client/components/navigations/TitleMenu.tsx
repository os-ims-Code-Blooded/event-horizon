import React, { FC } from 'react';
import {Link} from 'react-router-dom';
import LeaderBoard from '../leaderboard/Leaderboard';

type TitleProps = {
  user: Object | null;
};

const TitleMenu: FC<TitleProps> = ({user}) => {


  return (
    <div className="flex items-center justify-center min-h-screen bg-radial-custom h-screen max-h-screen text-text flex-col" aria-label="Title Menu">
      <div className=" flex flex-col space-y-10 text-center">
        <Link to="/game-board" replace={true} className="w-96 py-6 text-2xl p-3 bg-gradient-to-br from-yellow-500 to-yellow-700 text-text rounded-lg shadow-sm shadow-slate-200 hover:bg-none hover:bg-yellow-200 ">Play!</Link>
        <Link to="/instructions" replace={true} className="w-96 py-6 text-2xl p-3 bg-gradient-to-br from-slate-500 to slate-700 text-text rounded-lg shadow-sm shadow-slate-200 hover:bg-none hover:bg-slate-300">How To Play</Link>
        <Link to="/user-profile" replace={true} className="w-96 py-6 text-2xl p-3 bg-gradient-to-t from-green-500 to-green-700 text-text rounded-lg shadow-sm shadow-slate-200 hover:bg-none hover:bg-emerald-300">Profile</Link>
      </div>
      <div className='pt-5 grid sm:grid grid-col-1'>
        <LeaderBoard user={user} fullScreen={false}/>
      </div>
    </div>
  );
};

export default TitleMenu;