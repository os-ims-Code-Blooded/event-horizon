import React from 'react';
import { useState, useEffect } from 'react';

export default function FxText({
  enemyName,
  cardToPlay,
  user,
  myPrevRound,
  theirPrevRound,
  turnEnded


}){

  console.log("USER PREV ROUND", myPrevRound)
  console.log("ENEMY PREV ROUND", theirPrevRound)

  useEffect(()=>{





  })



  return(

    <div className='bg-slate-400'>
{theirPrevRound && myPrevRound && !turnEnded?

<div>




    {/* PLAYER BLOCKS, ENEMY FIRES */}
    {myPrevRound[0].action === "BLOCK"  && theirPrevRound[0].action === "FIRE" ?
      <div>
        {user.name} has shielded against {enemyName}'s barrage taking {theirPrevRound[0].damage / 2} damage
      </div>
    :
      null
    }

    {/* PLAYER BLOCKS, ENEMY FIRES */}
    {myPrevRound[0].action === "BLOCK"  && theirPrevRound[0].action !== "FIRE" ?
      <div>
        {user.name} has needlessly shielded their vessel
      </div>
    :
      null
    }

    {/* PLAYER FIRES WEAPON, ENEMY BLOCK */}
    {(myPrevRound[0].action === "FIRE" && myPrevRound[0].damage) && theirPrevRound[0].action === "BLOCK" ?
      <div>
        {user.name} has fired on {enemyName}'s shielded vessel for {myPrevRound[0].damage / 2} damage
      </div>
    :
      null
    }

  {/* PLAYER FIRES WEAPON, NO ENEMY BLOCK */}
    {(myPrevRound[0].action === "FIRE" && myPrevRound[0].damage) && theirPrevRound[0].action !== "BLOCK" ?
      <div>
        {user.name} has fired on {enemyName}'s vessel for {myPrevRound[0].damage} damage
      </div>
    :
      null
    }

  {/* PLAYER FIRES DEFAULT, ENEMY BLOCK */}
    {(myPrevRound[0].action === "FIRE" && !myPrevRound[0].damage) && theirPrevRound[0].action === "BLOCK" ?
      <div>
        {user.name} has fired on {enemyName}'s shielded vessel for {myPrevRound[0].damage / 2} damage
      </div>
    :
      null
    }

  {/* PLAYER FIRES DEFAULT, NO ENEMY BLOCK */}
    {(myPrevRound[0].action === "FIRE" && !myPrevRound[0].damage) && theirPrevRound[0].action !== "BLOCK" ?
      <div>
        {user.name} has fired on {enemyName}'s vessel for {myPrevRound[0].damage} damage
      </div>
    :
      null
    }


  {/* PLAYER LOADS ARMOR */}
    {myPrevRound[0].action === "LOAD" && myPrevRound[0].armor ?
      <div>
        {user.name} has increased defense by {myPrevRound[0].armor}
      </div>
    :
      null
    }

  {/* PLAYER LOADS WEAPON */}
    {myPrevRound[0].action === "LOAD" && myPrevRound[0].damage && cardToPlay?
      <div>
        {user.name} has armed {cardToPlay[0]}
      </div>
    :
      null
    }

  {/* ENEMY LOADS WEAPON */}
    {theirPrevRound[0].action === "LOAD" && theirPrevRound[0].damage ?
      <div>
        {enemyName} has armed their weapon
      </div>
    :
      null
    }

  {/* ENEMY LOADS ARMOR */}
    {theirPrevRound[0].action === "LOAD" && theirPrevRound[0].armor ?
      <div>
        {enemyName} has increased their armor by {}
      </div>
    :
    null
  }


  {/* ENEMY FIRES WEAPON, NO PLAYER BLOCK*/}
    {(theirPrevRound[0].action === "FIRE" && theirPrevRound[0].damage) && myPrevRound[0].action !== "BLOCK" ?
      <div>
        {enemyName} fired on {user.name}'s vessel for {theirPrevRound[0].damage} damage
      </div>
    :
      null
    }


  {/* ENEMY FIRES WEAPON, PLAYER BLOCK*/}
    {(theirPrevRound[0].action === "FIRE" && theirPrevRound[0].damage) && myPrevRound[0].action !== "BLOCK" ?
      <div>
        {enemyName} fired on {user.name}'s shielded vessel for {theirPrevRound[0].damage / 2} damage
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