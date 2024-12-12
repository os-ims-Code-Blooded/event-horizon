import React from 'react';
import { GiRosaShield } from "react-icons/gi";
import { GiMachineGunMagazine } from "react-icons/gi";
import { GiRocket } from "react-icons/gi";
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
            <GiRosaShield style={{fontSize: 50}} onClick={(e) => { actionClick(e) }}/>
          </button>
        ) : (
          <button
            value='BLOCK'
            className='w-full aspect-square bg-blue-600 hover:bg-blue-900 border-slate-600 border-2 text-white font-bold text-xs sm:text-sm md:text-base lg:text-lg rounded-full flex justify-center items-center overflow-hidden text-ellipsis'
            onClick={(e) => { actionClick(e) }}
          >
            <GiRosaShield style={{fontSize: 50}} onClick={(e) => { actionClick(e) }}/>
          </button>
        )}

        {turnEnded ? (
          <button
            value='LOAD'
            className='w-full aspect-square bg-gray text-white border-slate-600 border-2 font-bold text-xs sm:text-sm md:text-base lg:text-lg rounded-full cursor-not-allowed flex justify-center items-center overflow-hidden text-ellipsis'
          >
            <GiMachineGunMagazine style={{fontSize: 50}} onClick={(e) => { actionClick(e) }}/>
          </button>
        ) : (
          <button
            value='LOAD'
            className='w-full aspect-square bg-yellow-300 hover:bg-yellow-600 border-slate-600 border-2 text-black font-bold text-xs sm:text-sm md:text-base lg:text-lg rounded-full flex justify-center items-center overflow-hidden text-ellipsis'
            onClick={(e) => { actionClick(e) }}
          >
            <GiMachineGunMagazine style={{fontSize: 50}} onClick={(e) => { actionClick(e) }} />
          </button>
        )}

        {activeLoading || turnEnded ? (
          <button
            value='FIRE'
            className='w-full aspect-square bg-gray text-white font-bold text-xs border-slate-600 border-2 sm:text-sm md:text-base lg:text-lg rounded-full cursor-not-allowed flex justify-center items-center'
          >
            <GiRocket style={{fontSize: 50, transform: "rotate(270deg)"}} onClick={(e) => { actionClick(e) }}/>
          </button>
        ) : (
            <button
              value='FIRE'
              className='w-full aspect-square bg-red-600 hover:bg-red-900 text-white border-slate-600 border-2 font-bold text-xs sm:text-sm md:text-base lg:text-lg rounded-full flex justify-center items-center overflow-hidden text-ellipsis'
              onClick={(e) => actionClick(e) }
            >
              <GiRocket style={{fontSize: 50, transform: "rotate(270deg)"}} onClick={(e) => actionClick(e) }/>
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