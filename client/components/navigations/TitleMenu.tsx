import React, { FC } from 'react';

type TitleProps = {
  updateView: Function;
  view: String;
  user: Object | null;
  logOut: Function;
  getUser: Function;
};

const TitleMenu: FC<TitleProps> = ({user, updateView, view, getUser}) => {


  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-900 dark:bg-black h-screen">
      <div className=" flex flex-col space-y-10">

        <button onClick={(e) => updateView(e)} name="SelectGame" className="w-96 py-6 text-2xl p-3 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600">Play!</button>

        <button name="Instructions" onClick={(e) => {
          updateView(e);
          console.log(e);
          }} className="w-96 py-6 text-2xl p-3 bg-orange-800 text-white rounded-lg shadow-lg hover:bg-orange-900">How To Play</button>

        <button name="Profile" onClick={(e) => updateView(e)} className="w-96 py-6 text-2xl p-3 bg-purple-950 text-white rounded-lg shadow-lg hover:bg-indigo-950">Profile</button>
        
      </div>
    </div>
  );
};

export default TitleMenu;