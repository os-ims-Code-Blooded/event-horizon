import React, { FC } from 'react';
import {Link} from 'react-router-dom';
type TitleProps = {
  user: Object | null;
};

const TitleMenu: FC<TitleProps> = ({user}) => {


  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-900 dark:bg-black h-screen">
      <div className=" flex flex-col space-y-10 text-center">
        <Link to="/game-board" replace={true} className="w-96 py-6 text-2xl p-3 bg-gradient-to-br from-blue-600 to-gray-900 text-white rounded-lg shadow-lg hover:bg-none hover:bg-blue-600 ">Play!</Link>
        <Link to="/instructions" replace={true} className="w-96 py-6 text-2xl p-3 bg-gradient-to-br from-orange-500 to-gray-900 text-white rounded-lg shadow-lg hover:bg-none hover:bg-orange-500">How To Play</Link>
        <Link to="/user-profile" replace={true} className="w-96 py-6 text-2xl p-3 bg-gradient-to-br from-violet-600 to-stone-800 text-white rounded-lg shadow-lg hover:bg-none hover:bg-indigo-500">Profile</Link>
      </div>
    </div>
  );
};

export default TitleMenu;