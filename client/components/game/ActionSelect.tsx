import React from 'react';

export default function ActionSelect({
  playerAction, 
  enemyLastAction,
  cardToPlay,
  turnEnded,
  activeLoading,
  actionClick,
  enemyCard,
  enemyTurnEnd
  
}){



  return(
    <div className='flex items-center justify-center h-full w-full max-w-md mx-auto'>
      <div className='grid grid-cols-3 gap-4 w-full h-full'>

        {activeLoading || turnEnded ? (
          <button
            value='BLOCK'
            className='w-full aspect-square bg-gray border-slate-600 border-2 text-white font-bold text-xs sm:text-sm md:text-base lg:text-lg rounded-full cursor-not-allowed flex justify-center items-center overflow-hidden text-ellipsis'
          >
            SHIELD
          </button>
        ) : (
          <button
            value='BLOCK'
            className='w-full aspect-square bg-blue-600 hover:bg-blue-900 border-slate-600 border-2 text-white font-bold text-xs sm:text-sm md:text-base lg:text-lg rounded-full flex justify-center items-center overflow-hidden text-ellipsis focus:ring-4 focus:ring-blue-600'
            onClick={(e) => { actionClick(e) }}
          >
            SHIELD
          </button>
        )}

        {turnEnded ? (
          <button
            value='LOAD'
            className='w-full aspect-square bg-gray text-white border-slate-600 border-2 font-bold text-xs sm:text-sm md:text-base lg:text-lg rounded-full cursor-not-allowed flex justify-center items-center overflow-hidden text-ellipsis'
          >
            ARM
          </button>
        ) : (
          <button
            value='LOAD'
            className='w-full aspect-square bg-yellow-300 hover:bg-yellow-600 border-slate-600 border-2 text-black font-bold text-xs sm:text-sm md:text-base lg:text-lg rounded-full flex justify-center items-center overflow-hidden text-ellipsis focus:ring-4 focus:ring-yellow-300'
            onClick={(e) => { actionClick(e) }}
          >
            ARM
          </button>
        )}

        {activeLoading || turnEnded ? (
          <button
            value='FIRE'
            className='w-full aspect-square bg-gray text-white font-bold text-xs border-slate-600 border-2 sm:text-sm md:text-base lg:text-lg rounded-full cursor-not-allowed flex justify-center items-center'
          >
            FIRE
          </button>
        ) : (
          <button
            value='FIRE'
            className='w-full aspect-square bg-red-600 hover:bg-red-900 text-white border-slate-600 border-2 font-bold text-xs sm:text-sm md:text-base lg:text-lg rounded-full flex justify-center items-center overflow-hidden text-ellipsis focus:ring-4 focus:ring-red-600'
            onClick={(e) => { actionClick(e) }}
          >
            FIRE
          </button>
        )}
      </div>
    </div>




  
)
}
{/* <div className=' p-2 bg-white text-black font-bold w-96' >CURRENT ACTION SELECTED: {playerAction}</div>

<div className=' p-2 bg-black text-white font-bold w-96' >ENEMY'S LAST ACTION: {enemyLastAction}
    {enemyCard && enemyLastAction === 'FIRE' && !enemyTurnEnd ?
    
      <>
      d {enemyCard[0]}
      </>

    :
    
      null
    }

</div> */}