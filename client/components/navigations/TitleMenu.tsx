import React, { FC, useState } from 'react';
import {Link} from 'react-router-dom';
import LeaderBoard from '../leaderboard/Leaderboard';

import Credits from '../profile/Credits.tsx';

type TitleProps = {
  user: Object | null;
  volume: any;
  click13: any;
  click6: any;
  playHeavyClickSFX: any;
};

const TitleMenu: FC<TitleProps> = ({user, click13, click6, playHeavyClickSFX}) => {

  const [showCreditsModal, setShowCreditsModal] = useState(false)


  return (
    <div className="box-border grid pt-20 items-center justify-center min-h-screen h-screen max-h-screen text-text dark:text-darkText flex-col" aria-label="Title Menu">
      <div className="flex flex-row text-center space-between gap-2">
        <div className='bg-starfield-light dark:bg-starfield absolute max-h-screen inset-0 z-9'></div>


        {/* How To Play Button Container */}

        <div className="w-28 h-28 rounded-full bg-slate-700 relative">
          <Link
            to="/instructions"
            onClick={click13}
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
            onClick={click13}
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
            onClick={click6}
            replace={true}
            className="absolute inset-0 z-10 m-auto w-24 h-24 bg-success dark:bg-darkGreen text-text dark:text-darkText rounded-full shadow-md shadow-slate-200 flex items-center justify-center text-xl font-semibold dark:hover:bg-slate-300 hover:animate-pulse"

          >
            Play!
          </Link>
        </div>
      </div>
      <div className="relative z-10 grid sm:grid grid-col-1">
        <LeaderBoard user={user} fullScreen={false} />
      </div>
      <div className='p-4'></div>
        <div>



          {showCreditsModal && (
          <div className="modal fixed inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 z-40 modal-middle ">
            <div className="bg-slate-600 rounded-lg shadow-lg flex flex-col items-center justify-items-center w-2/3 gap-3 z-40 ">
              <h2 className="text-2xl pt-2 justify-center text-center font-bold text-white mb-4">Credits</h2>
              
             <Credits/>
              <button
                onClick={() => {
                  playHeavyClickSFX()
                  setShowCreditsModal(false)}}
                className="px-4 py-2 bg-slate-700 text-white rounded-lg shadow hover:bg-slate-300"
              >
                close
              </button>
              <div className='p-4'></div>
            </div>
          </div>
          )}

        </div>

{!showCreditsModal? 

      <div className='px-4 py-2 bg-slate-700 text-white rounded-lg shadow hover:bg-slate-300 z-10'>
          <button onClick={()=>{
            playHeavyClickSFX()
            setShowCreditsModal(!showCreditsModal)}}>credits
          </button>
      </div>


:

      null


}
    </div>
  );
};

export default TitleMenu;