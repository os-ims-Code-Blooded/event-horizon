import React from 'react';
import { useState, useEffect } from 'react';



export default function Animations({
  enemyName,
  cardToPlay,
  user,
  myPrevRound,
  theirPrevRound,
  turnEnded,

}){


  useEffect(()=>{
    // setTimeout(setRoundSoundsPlayed(true), 10000);
  })
  // console.log("USER PREV ROUND", myPrevRound)
  // console.log("ENEMY PREV ROUND", theirPrevRound)

  return(

    <div className='flex flex-row'>
      {theirPrevRound && myPrevRound && !turnEnded?
      <div className='text-sm'>
      {/* PLAYER BLOCKS, ENEMY FIRES */}
      {myPrevRound[0].action === "BLOCK"  && theirPrevRound[0].action === "FIRE" && theirPrevRound[0].damage?
        <div className='text-sm'>
          <div className='text-blue-600 animate-pulse'>BLOCK</div>
          <strong className='text-violet-700 animate-ping'>-{theirPrevRound[0].damage / 2}</strong>
          <div className='text-error animate-ping'>FIRE</div>
         
        </div>
        :
          null
        }
      {/* PLAYER BLOCKS, ENEMY DEFAULT FIRES */}
      {myPrevRound[0].action === "BLOCK"  && theirPrevRound[0].action === "FIRE" && !theirPrevRound[0].card_id?
      <div className='text-sm'>
        <div className='text-blue-600 animate-pulse'>BLOCK</div>
        <strong className='text-violet-700 animate-ping'>-{theirPrevRound[0].damage + 3}</strong>
        <div className='text-error animate-ping'>FIRE</div>
      </div>
        :
          null
        }

      {/* PLAYER BLOCKS, ENEMY DOES NOT FIRE */}
      {myPrevRound[0].action === "BLOCK"  && theirPrevRound[0].action !== "FIRE" ?
           <div className='text-sm'>
           <div className='text-blue-600 animate-pulse'>BLOCK</div>
         </div>
        :
          null
        }
      {/* PLAYER FIRES WEAPON, ENEMY BLOCK */}
      {myPrevRound[0].action === "FIRE" && myPrevRound[0].damage && myPrevRound[0].card_id  && theirPrevRound[0].action === "BLOCK" ?
           <div className='text-sm'>
           <div className='text-error animate-ping'>FIRE</div>
           <strong className='text-violet-700 animate-ping'> {myPrevRound[0].damage / 2}</strong>
           <div className='text-blue-600 animate-pulse'>BLOCK</div>
         </div>
      :
        null
      }

    {/* PLAYER FIRES WEAPON, NO ENEMY BLOCK */}
      {(myPrevRound[0].action === "FIRE" && myPrevRound[0].damage && myPrevRound[0].card_id) && theirPrevRound[0].action !== "BLOCK" ?
        
                <div className='text-sm'>
                <div className='text-error animate-ping'>FIRE</div>
                <strong className='text-error animate-ping'>   {myPrevRound[0].damage} </strong>
        
              </div>
           
      :
        null
      }

    {/* PLAYER FIRES DEFAULT, ENEMY BLOCK */}
      {(myPrevRound[0].action === "FIRE" && !myPrevRound[0].card_id) && theirPrevRound[0].action === "BLOCK" ?
          <div className='text-sm'>
          <div className='text-error animate-ping'>FIRE</div>
          <strong className='text-violet-700 animate-ping'> {myPrevRound[0].damage + 3}</strong>
          <div className='text-blue-600 animate-pulse'>BLOCK</div>
        </div>
      :
        null
      }

    {/* PLAYER FIRES DEFAULT, NO ENEMY BLOCK */}
      {(myPrevRound[0].action === "FIRE" && !myPrevRound[0].card_id) && theirPrevRound[0].action !== "BLOCK" ?
         <div className='text-sm'>
         <div className='text-error animate-ping'>FIRE</div>
         <strong className='text-error animate-ping'>   {myPrevRound[0].damage + 5} </strong>
     
       </div>
      :
        null
      }
    {/* PLAYER LOADS ARMOR */}
      {myPrevRound[0].action === "LOAD" && myPrevRound[0].armor ?


          <div className='text-sm'>
          <div className='text-yellow-300 animate-ping'>LOAD</div>
          <strong className='text-yellow-300 animate-ping'> +{myPrevRound[0].armor}</strong>
          </div>
      :
        null
      }
    {/* PLAYER LOADS WEAPON */}
      {myPrevRound[0].action === "LOAD" && myPrevRound[0].damage && cardToPlay?
     <div className='text-sm'>
     <div className='text-yellow-300 animate-ping'>LOAD</div>
     <strong className='text-yellow-300 animate-ping'> {cardToPlay[0]}</strong>
     </div>
      :
        null
      }
    {/* ENEMY LOADS WEAPON */}
      {theirPrevRound[0].action === "LOAD" && theirPrevRound[0].damage ?
     <div className='text-sm'>
     <div className='text-yellow-300 animate-ping'>LOAD</div>
     </div>
      :
        null
      }
    {/* ENEMY LOADS ARMOR */}
      {theirPrevRound[0].action === "LOAD" && theirPrevRound[0].armor ?
           <div className='text-sm'>
           <div className='text-yellow-300 animate-ping'>LOAD</div>
           </div>
        :
        null
      }
    {/* ENEMY FIRES WEAPON, NO PLAYER BLOCK*/}
      {theirPrevRound[0].action === "FIRE" && theirPrevRound[0].card_id && myPrevRound[0].action !== "BLOCK" ?
       <div className='text-sm'>
       <div className='text-error animate-ping'>FIRE</div>
       <strong className='text-error animate-ping'> -{theirPrevRound[0].damage} </strong>
   
     </div>
      :
        null
      }

    </div>
    :
      null
    }
   </div>
  )
}