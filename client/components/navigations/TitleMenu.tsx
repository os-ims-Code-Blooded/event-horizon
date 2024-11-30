import React, { FC } from 'react';
import {Link} from 'react-router-dom';
import LeaderBoard from '../leaderboard/Leaderboard';

type TitleProps = {
  user: Object | null;
};

const TitleMenu: FC<TitleProps> = ({user}) => {


  return (
    <div className="flex items-center justify-center min-h-screen [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)] h-screen flex-col" aria-label="Title Menu">
      <div className=" flex flex-col space-y-10 text-center">
        <Link to="/game-board" replace={true} className="w-96 py-6 text-2xl p-3 bg-gradient-to-br from-yellow-500 to-gray-900 text-white rounded-lg shadow-lg hover:bg-none hover:bg-blue-600 ">Play!</Link>
        <Link to="/instructions" replace={true} className="w-96 py-6 text-2xl p-3 bg-gradient-to-br from-gray to-gray-900 text-white rounded-lg shadow-lg hover:bg-none hover:bg-orange-500">How To Play</Link>
        <Link to="/user-profile" replace={true} className="w-96 py-6 text-2xl p-3 bg-gradient-to-br from-purple-1 to-stone-800 text-white rounded-lg shadow-lg hover:bg-none hover:bg-indigo-500">Profile</Link>
      </div>
      <div className='pt-5 grid sm:grid grid-col-1'>
        <LeaderBoard user={user} />
      </div>
    </div>
  );
};

export default TitleMenu;