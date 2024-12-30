import React, { FC, useEffect, useState } from 'react';

const GameplayOverview = () => {

  return (
    <div id='gameplayOverview' style={{ width: "80%", display: "flex", flexDirection: "column",
      justifyContent: "center", justifyItems: "center"}}>
      
      <div className='text-center justify-items-center items-center self-center pb-4'>
        <span>
          <h2 className='text-2xl'>What does a game look like in Event Horizon?</h2>
        </span>
      </div>

      <span>
        <p>
          Event Horizon is a turn-based card battling game; each player is allowed one action per every turn (round). Whenever a player starts a game, 
          they begin with 50 Hull Integrity and 20 Armor on the first round. As players receive damage, these values will decrement 
          and will eventually become reduced to zero (0). An example of this information can be viewed below!
        </p>
      </span>
      
      <div className='pb-8 pt-8'>
          <hr></hr>
      </div>

      <div className='justify-center items-center justify-items-center pt-4 pb-4'>
        <div style={{height: "33%", width: "66%"}}>
          <div className='text-green-600 font-bold text-center pb-2'>Player One</div>
            <div className="w-full flex flex-grow flex-col gap-4 justify-items-end">
              
              <div className={`bg-slate-700 h-5 rounded-full text-center justify-items-center text-text dark:text-darkText text-sm pt-5 relative`}>
                <div className={`shadow-lg shadow-black bg-blue-400 h-5 rounded-full text-center justify-items-center text-text dark:text-darkText text-sm pt-5 absolute inset-y-0`} style={{ width: `${(20/100) * 100}%`, minWidth: '40%' }}></div>
                <div className='pl-4 h-5 justify-items-center flex-1 text-center whitespace-nowrap text-xs sm:text-sm inset-y-0 absolute'>{`Armor: ${20}`}</div>
              </div>

              <div className={`flex bg-slate-500 dark:bg-slate-600 h-5 rounded-full text-center relative justify-items-center text-white text-sm`}>
                <div className={`shadow-lg shadow-black bg-error h-5 rounded-full text-center justify-items-end text-text dark:text-darkText text-sm transition-all`} style={{ width: `${(50 / 50) * 100}%`, minWidth: '40%' }}></div>
                <div className='pl-4 h-4 flex-1 justify-items-center whitespace-nowrap justify-center text-center text-sm inset-y-0 absolute'>{`Hull Integrity: ${50} / 50`}</div>
              </div>
          </div>
        </div>
      </div>

      <div className='pt-6 pb-6'>
        <span>
          <p>
            Your goal is to try to survive, and defeat your enemy! Visual indicators for the health bars are shown above. 
            Whenever you take damage to your armor or health, those bars will briefly shake. If you aren't sure what happened on the previous round, you can
            look at your enemy's munition status to see what card they used against you on the previous turn. If this still isn't clear, you may also look at
            the combat log (in the top left of your screen) to see what actions were taken on the previous round!
          </p>
        </span>
      </div>

      <div className='justify-center items-center justify-items-center pt-4 pb-4'>
        <div className='shadow-lg shadow-black bg-slate-400 flex flex-col p-1 gap-1 border-4 border-slate-600 rounded-lg w-2/3'>
        <p>STATUS REPORT:</p>
        <p>You fired on Player Two's vessel for 10 damage.</p>
        <p>Player Two upgraded their armor!</p>
        </div>
      </div>

      <div className='pt-6 pb-6'>
        <span>
          <p>
            We recommend that new players also read about basic game mechanics, so that they are aware of their options when playing the game. There's more to
            your strategy than just playing a card, and what you choose to do on a round can make a significant difference!
          </p>
        </span>
      </div>

    </div>
  )

}

export default GameplayOverview;