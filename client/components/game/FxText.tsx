import React from 'react';
import { useState, useEffect } from 'react';

export default function FxText({
  enemyName,
  cardToPlay,
  user,
  myPrevRound,
  theirPrevRound,
  turnEnded,
  volume


}){

  // console.log("USER PREV ROUND", myPrevRound)
  // console.log("ENEMY PREV ROUND", theirPrevRound)

  return(

    <div className='bg-slate-400 flex flex-col p-1 gap-1 border-4 border-slate-600 rounded-lg shadow-md w-2/3'>
      {theirPrevRound && myPrevRound && !turnEnded?

      <div className='text-sm'>




    {/* PLAYER BLOCKS, ENEMY FIRES */}
    {myPrevRound[0].action === "BLOCK"  && theirPrevRound[0].action === "FIRE" && theirPrevRound[0].damage?
      <div className='text-sm'>
        You shielded against {enemyName}'s barrage taking {theirPrevRound[0].damage / 2} damage
        <div className='p-4'></div>
      </div>
    :
      null
    }


    {/* PLAYER BLOCKS, ENEMY DEFAULT FIRES */}
    {myPrevRound[0].action === "BLOCK"  && theirPrevRound[0].action === "FIRE" && !theirPrevRound[0].card_id?
      <div className='text-sm'>
        You shielded against {enemyName}'s barrage taking 3 damage
        <div className='p-4'></div>
      </div>
    :
      null
    }

    {/* PLAYER BLOCKS, ENEMY FIRES */}
    {myPrevRound[0].action === "BLOCK"  && theirPrevRound[0].action !== "FIRE" ?
      <div className='text-sm'>
        You needlessly shielded your vessel
        <div className='p-4'></div>
      </div>
    :
      null
    }

    {/* PLAYER FIRES WEAPON, ENEMY BLOCK */}
    {myPrevRound[0].action === "FIRE" && myPrevRound[0].damage && myPrevRound[0].card_id  && theirPrevRound[0].action === "BLOCK" ?
      <div className='text-sm'>
         You fired on {enemyName}'s shielded vessel for {myPrevRound[0].damage / 2} damage
         <div className='p-4'></div>
      </div>
    :
      null
    }

  {/* PLAYER FIRES WEAPON, NO ENEMY BLOCK */}
    {(myPrevRound[0].action === "FIRE" && myPrevRound[0].damage && myPrevRound[0].card_id) && theirPrevRound[0].action !== "BLOCK" ?
      <div className='text-sm'>
        You fired on {enemyName}'s vessel for {myPrevRound[0].damage} damage
        <div className='p-4'></div>
      </div>
    :
      null
    }

  {/* PLAYER FIRES DEFAULT, ENEMY BLOCK */}
    {(myPrevRound[0].action === "FIRE" && !myPrevRound[0].card_id) && theirPrevRound[0].action === "BLOCK" ?
      <div className='text-sm'>
        You fired on {enemyName}'s shielded vessel for 3 damage
        <div className='p-4'></div>
      </div>
    :
      null
    }

  {/* PLAYER FIRES DEFAULT, NO ENEMY BLOCK */}
    {(myPrevRound[0].action === "FIRE" && !myPrevRound[0].card_id) && theirPrevRound[0].action !== "BLOCK" ?
      <div className='text-sm'>
        You fired on {enemyName}'s vessel for 5 damage
        <div className='p-4'></div>
      </div>
    :
      null
    }


  {/* PLAYER LOADS ARMOR */}
    {myPrevRound[0].action === "LOAD" && myPrevRound[0].armor ?
      <div className='text-sm'>
        You increased defense by {myPrevRound[0].armor}
        <div className='p-4'></div>
      </div>
    :
      null
    }

  {/* PLAYER LOADS WEAPON */}
    {myPrevRound[0].action === "LOAD" && myPrevRound[0].damage && cardToPlay?
      <div className='text-sm'>
        You armed {cardToPlay[0]}
        <div className='p-4'></div>
      </div>
    :
      null
    }

  {/* ENEMY LOADS WEAPON */}
    {theirPrevRound[0].action === "LOAD" && theirPrevRound[0].damage ?
      <div className='text-sm'>
        {enemyName} armed their weapon
        <div className='p-4'></div>
      </div>
    :
      null
    }

  {/* ENEMY LOADS ARMOR */}
    {theirPrevRound[0].action === "LOAD" && theirPrevRound[0].armor ?
      <div className='text-sm'>
        {enemyName} upgraded their armor
        <div className='p-4'></div>
      </div>
    :
    null
  }


  {/* ENEMY FIRES WEAPON, NO PLAYER BLOCK*/}
    {theirPrevRound[0].action === "FIRE" && theirPrevRound[0].card_id && myPrevRound[0].action !== "BLOCK" ?
      <div className='text-sm'>
        {enemyName} fired on your vessel for {theirPrevRound[0].damage} damage
        <div className='p-4'></div>
      </div>
    :
      null
    }


  {/* ENEMY FIRES WEAPON, PLAYER BLOCK*/}
    {/* {theirPrevRound[0].action === "FIRE" && theirPrevRound[0].card_id && myPrevRound[0].action === "BLOCK" ?
      <div className='text-sm'>
       {enemyName} fired on your shielded vessel for {theirPrevRound[0].damage / 2} damage
       <div className='p-4'></div>
      </div>
    :
      null
    } */}

  {/* ENEMY FIRES DEFAULT WEAPON, PLAYER BLOCK*/}
    {theirPrevRound[0].action === "FIRE" && !theirPrevRound[0].card_id && myPrevRound[0].action === "BLOCK" ?
      <div className='text-sm'>
       {enemyName} fired on your shielded vessel for 3 damage
       <div className='p-4'></div>
      </div>
    :
      null
    }

  {/* ENEMY FIRES DEFAULT WEAPON, NO PLAYER BLOCK*/}
  {theirPrevRound[0].action === "FIRE" && !theirPrevRound[0].card_id && myPrevRound[0].action !== "BLOCK" ?
      <div className='text-sm'>
        {enemyName} fired on your vessel for 5 damage
        <div className='p-4'></div>
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