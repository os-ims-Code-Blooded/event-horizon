import React from 'react';
import axios from 'axios';



export default function ActionSelect({
  playerAction, 
  setPlayerAction, 
  enemyLastAction,
  cardToPlay,
  weaponArmed,
  setWeaponArmed, 
  setWeaponFired,
  turnEnded,
  activeLoading,
  actionClick
}){


  // const actionClick = (e) =>{
  //   console.log("click value", e.target.value)

  //   setPlayerAction(e.target.value)

  //   if (e.target.value === 'load'){
  //     setWeaponArmed(true)
  //   } else {
  //     setWeaponArmed(false)
  //   }

  //   if (e.target.value === 'fire'){
  //     setWeaponFired(true)
  //   } else {
  //     setWeaponFired(false)
  //   }



  // }
  return(
    <>
      <div className='flex flex-cols gap-3 justify-items-center'>

      {activeLoading || turnEnded?

        <button

        value='block'
        className='cursor-not-allowed p-4 bg-gray-500 text-white font-bold '
        >SHIELDS
        </button>

        :

        <button 
        value='block' 
        className=' p-4 bg-blue-600 hover:bg-blue-900 text-white font-bold focus:ring-4 focus:ring-blue-300'
        onClick={(e)=>{actionClick(e)}}
        >SHIELDS
        </button>
      }



        <div></div>

        {turnEnded?

          <button

            value='load'
            className='cursor-not-allowed p-4 bg-gray-500 text-white font-bold '
            >ARM
            </button>

            :

            <button 
            value='load' 
            className='p-4 bg-yellow-300 hover:bg-yellow-600 text-white font-bold focus:ring-4 focus:ring-yellow-200'
            onClick={(e)=>{actionClick(e)}}
            >ARM
            </button>
        }


        <div></div>


          {!cardToPlay || activeLoading || turnEnded?

          <button

          value='shoot'
          className='cursor-not-allowed p-4 bg-gray-500 text-white font-bold '
          >FIRE
          </button>

          :

          <button
          value='shoot'
          className='p-4 bg-red-600 hover:bg-red-900 text-white font-bold focus:ring-4 focus:ring-red-300'
          onClick={(e)=>{actionClick(e)}}
          >FIRE
          </button>

          }

      </div>
      <br></br>
      <div className=' p-4 bg-white text-black font-bold' >CURRENT ACTION SELECTED: {playerAction}</div>
  
      <div className=' p-4 bg-black text-white font-bold' >ENEMY'S LAST ACTION: {enemyLastAction}</div>

      {/* <div className='justify-items-end'>
        <button 
        className='bg-emerald-500  hover:bg-emerald-900 text-white font-bold focus:ring-4 focus:ring-emerald-600 ' 
        onClick={endTurn}>COMMIT TURN
        </button>
      </div> */}
    </>
  )
}