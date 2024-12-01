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
    <>
      <div className='flex flex-cols gap-2 justify-items-center'>

      {activeLoading || turnEnded?

        <button

        value='block'
        className='cursor-not-allowed p-4 bg-gray text-white font-bold rounded-sm'
        >SHIELDS
        </button>
        :
        <button 
        value='block' 
        className=' p-4 bg-blue-600 hover:bg-blue-900 text-white font-bold focus:ring-4 focus:ring-blue-300 rounded-sm'
        onClick={(e)=>{actionClick(e)}}
        >SHIELDS
        </button>
      }

        <div></div>

        {turnEnded?

          <button

            value='load'
            className='cursor-not-allowed p-4 bg-gray text-white font-bold rounded-sm '
            >ARM
            </button>

            :

            <button 
            value='load' 
            className='p-4 bg-yellow-300 hover:bg-yellow-600 text-white font-bold focus:ring-4 focus:ring-yellow-200 rounded-sm'
            onClick={(e)=>{actionClick(e)}}
            >ARM
            </button>
        }


        <div></div>


          {activeLoading || turnEnded?

          <button

          value='fire'
          className='cursor-not-allowed p-4 bg-gray text-white font-bold rounded-sm '
          >FIRE
          </button>

          :

          <button
          value='fire'
          className='p-4 bg-red-600 hover:bg-red-900 text-white font-bold focus:ring-4 focus:ring-red-300 rounded-sm'
          onClick={(e)=>{actionClick(e)}}
          >FIRE
          </button>

          }

      </div>
      <br></br>
      <div className=' p-2 bg-white text-black font-bold' >CURRENT ACTION SELECTED: {playerAction}</div>
  
      <div className=' p-2 bg-black text-white font-bold' >ENEMY'S LAST ACTION: {enemyLastAction}
          {enemyCard && enemyLastAction === 'fire' && !enemyTurnEnd ?
          
            <>
            d {enemyCard[0]}
            </>

          :
          
            null
          }

      </div>

    </>
  )
}