import React from 'react';
import axios from 'axios';



export default function ActionSelect({ 
  playerAction, 
  setPlayerAction, 
  enemyAction,
  setWeaponArmed, 
  setWeaponFired,
  turnEnded
}){


  const actionClick = (e) =>{
    console.log("click value", e.target.value)

    setPlayerAction(e.target.value)
    if (e.target.value === 'load'){
      setWeaponArmed(true)
    } else {
      setWeaponArmed(false)
    }

    setPlayerAction(e.target.value)
    if (e.target.value === 'fire'){
      setWeaponFired(true)
    } else {
      setWeaponFired(false)
    }



  }
  return(
    <>
      <div className='flex flex-cols gap-3 justify-items-center'>

        <button 
        value='block' 
        className=' p-4 bg-blue-600 hover:bg-blue-900 text-white font-bold focus:ring-4 focus:ring-blue-300'
        onClick={(e)=>{actionClick(e)}}
        >SHIELDS
        </button>

        <div></div>

        <button 
        value='load' 
        className='p-4 bg-yellow-300 hover:bg-yellow-600 text-white font-bold focus:ring-4 focus:ring-yellow-200'
        onClick={(e)=>{actionClick(e)}}
        >RE-ARM
        </button>

        <div></div>

        <button 
        value='shoot' 
        className='p-4 bg-red-600 hover:bg-red-900 text-white font-bold focus:ring-4 focus:ring-red-300'
        onClick={(e)=>{actionClick(e)}}
        >CANNONS
        </button>

      </div>
      <br></br>
      <div className=' p-4 bg-white text-black font-bold' >ACTION SELECTED: {playerAction}</div>
  
      <div className=' p-4 bg-black text-white font-bold' >ENEMY'S ACTION: {turnEnded ? enemyAction : null}</div>

      {/* <div className='justify-items-end'>
        <button 
        className='bg-emerald-500  hover:bg-emerald-900 text-white font-bold focus:ring-4 focus:ring-emerald-600 ' 
        onClick={endTurn}>COMMIT TURN
        </button>
      </div> */}
    </>
  )
}