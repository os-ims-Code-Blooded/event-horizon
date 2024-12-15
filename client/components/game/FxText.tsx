import React from 'react';
import { useState, useEffect } from 'react';
import useSound from 'use-sound';

import takehit from '../../sfx/takehit.wav'
import enemyalert from '../../sfx/enemyalert.wav'
import landhit from '../../sfx/landhit.wav'
import enemyblock from '../../sfx/enemyblock.wav'
import blockhit from '../../sfx/blockhit.wav'
import defaulthit from '../../sfx/defaulthit.wav'
import freeshield from '../../sfx/freeshield.wav'

export default function FxText({
  enemyName,
  cardToPlay,
  user,
  myPrevRound,
  theirPrevRound,
  turnEnded,
  roundSoundsPlayed,
  setRoundSoundsPlayed,
  soundVolume,
  volume
}){
  // Sound Effects
  const [playTakeHitSFX] = useSound(takehit, volume);
  const [playEnemyAlertSFX] = useSound(enemyalert, volume);
  const [playLandHitSFX] = useSound(landhit, volume);
  const [playEnemyBlockSFX] = useSound(enemyblock, volume);
  const [playBlockSFX] = useSound(blockhit, volume);
  const [playDefaultHitSFX] = useSound(defaulthit, volume);
  const [playFreeShieldSFX] = useSound(freeshield, volume);

  useEffect(()=>{
    // setTimeout(setRoundSoundsPlayed(true), 10000);
  })
  // console.log("USER PREV ROUND", myPrevRound)
  // console.log("ENEMY PREV ROUND", theirPrevRound)

  return(

    <div className='bg-slate-400 flex flex-col p-1 gap-1 border-4 border-slate-600 rounded-lg shadow-md w-2/3'>
      {theirPrevRound && myPrevRound && !turnEnded?
      <div className='text-sm'>
      {/* PLAYER BLOCKS, ENEMY FIRES */}
      {myPrevRound[0].action === "BLOCK"  && theirPrevRound[0].action === "FIRE" && theirPrevRound[0].damage?
        <div className='text-sm text-text dark:text-darkText'>
          You shielded against {enemyName}'s barrage taking {theirPrevRound[0].damage / 2} damage 
          {!roundSoundsPlayed? playBlockSFX():null}
          {/* {setRoundSoundsPlayed(true)} */}
          <div className='p-4'></div>
        </div>
        :
          null
        }
      {/* PLAYER BLOCKS, ENEMY DEFAULT FIRES */}
      {myPrevRound[0].action === "BLOCK"  && theirPrevRound[0].action === "FIRE" && !theirPrevRound[0].card_id?
        <div className='text-sm text-text dark:text-darkText'>
          You shielded against {enemyName}'s barrage taking <strong>3</strong> damage

          {!roundSoundsPlayed? playBlockSFX():null}
          {/* {setRoundSoundsPlayed(true)} */}
          <div className='p-4'></div>
        </div>
        :
          null
        }

      {/* PLAYER BLOCKS, ENEMY DOES NOT FIRE */}
      {myPrevRound[0].action === "BLOCK"  && theirPrevRound[0].action !== "FIRE" ?
        <div className='text-sm text-text dark:text-darkText'>
          You needlessly shielded your vessel

          {!roundSoundsPlayed ? playFreeShieldSFX() : null }

          {/* {setRoundSoundsPlayed(true)} */}
          <div className='p-4'></div>
        </div>
        :
          null
        }
      {/* PLAYER FIRES WEAPON, ENEMY BLOCK */}
      {myPrevRound[0].action === "FIRE" && myPrevRound[0].damage && myPrevRound[0].card_id  && theirPrevRound[0].action === "BLOCK" ?
        <div className='text-sm text-text dark:text-darkText'>
          You fired on {enemyName}'s shielded vessel for {myPrevRound[0].damage / 2} damage 
          {/* {playEnemyBlockSFX()} */}
          {!roundSoundsPlayed? playEnemyBlockSFX():null}
          <div className='p-4'></div>
        </div>
      :
        null
      }

    {/* PLAYER FIRES WEAPON, NO ENEMY BLOCK */}
      {(myPrevRound[0].action === "FIRE" && myPrevRound[0].damage && myPrevRound[0].card_id) && theirPrevRound[0].action !== "BLOCK" ?
        <div className='text-sm text-text dark:text-darkText'>
          You fired on {enemyName}'s vessel for {myPrevRound[0].damage} damage 
          {/* {playLandHitSFX()} */}
          {!roundSoundsPlayed? playLandHitSFX():null}
          <div className='p-4'></div>
        </div>
      :
        null
      }

    {/* PLAYER FIRES DEFAULT, ENEMY BLOCK */}
      {(myPrevRound[0].action === "FIRE" && !myPrevRound[0].card_id) && theirPrevRound[0].action === "BLOCK" ?
        <div className='text-sm text-text dark:text-darkText'>
          You fired on {enemyName}'s shielded vessel for 3 damage 
          {/* {playEnemyBlockSFX()} */}
          {!roundSoundsPlayed? playEnemyBlockSFX():null}
          <div className='p-4'></div>
        </div>
      :
        null
      }

    {/* PLAYER FIRES DEFAULT, NO ENEMY BLOCK */}
      {(myPrevRound[0].action === "FIRE" && !myPrevRound[0].card_id) && theirPrevRound[0].action !== "BLOCK" ?
        <div className='text-sm text-text dark:text-darkText'>
          You fired on {enemyName}'s vessel for 5 damage 
          {/* {playLandHitSFX()} */}
          {!roundSoundsPlayed? playLandHitSFX():null}
          <div className='p-4'></div>
        </div>
      :
        null
      }
    {/* PLAYER LOADS ARMOR */}
      {myPrevRound[0].action === "LOAD" && myPrevRound[0].armor ?
        <div className='text-sm text-text dark:text-darkText'>
          You increased defense by {myPrevRound[0].armor}
          <div className='p-4'></div>
        </div>
      :
        null
      }
    {/* PLAYER LOADS WEAPON */}
      {myPrevRound[0].action === "LOAD" && myPrevRound[0].damage && cardToPlay?
        <div className='text-sm text-text dark:text-darkText'>
          You armed {cardToPlay[0]}
          <div className='p-4'></div>
        </div>
      :
        null
      }
    {/* ENEMY LOADS WEAPON */}
      {theirPrevRound[0].action === "LOAD" && theirPrevRound[0].damage ?
        <div className='text-sm text-text dark:text-darkText'>
          {enemyName} armed their weapon 
          {/* {playEnemyAlertSFX()} */}
          {!roundSoundsPlayed? playEnemyAlertSFX():null}
          <div className='p-4'></div>
        </div>
      :
        null
      }
    {/* ENEMY LOADS ARMOR */}
      {theirPrevRound[0].action === "LOAD" && theirPrevRound[0].armor ?
        <div className='text-sm text-text dark:text-darkText'>
          {enemyName} upgraded their armor 
          {/* {playEnemyAlertSFX()} */}
          {!roundSoundsPlayed? playEnemyAlertSFX():null}
          <div className='p-4'></div>
        </div>
        :
        null
      }
    {/* ENEMY FIRES WEAPON, NO PLAYER BLOCK*/}
      {theirPrevRound[0].action === "FIRE" && theirPrevRound[0].card_id && myPrevRound[0].action !== "BLOCK" ?
        <div className='text-sm text-text dark:text-darkText'>
          {enemyName} fired on your vessel for {theirPrevRound[0].damage} damage 
          {/* {playTakeHitSFX()} */}
          {!roundSoundsPlayed? playTakeHitSFX():null}
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
        <div className='text-sm text-text dark:text-darkText'>
        {enemyName} fired on your shielded vessel for 3 damage
        <div className='p-4'></div>
        </div>
      :
        null
      }
    {/* ENEMY FIRES DEFAULT WEAPON, NO PLAYER BLOCK*/}
      {theirPrevRound[0].action === "FIRE" && !theirPrevRound[0].card_id && myPrevRound[0].action !== "BLOCK" ?
          <div className='text-sm text-text dark:text-darkText'>
            {enemyName} fired on your vessel for 5 damage
            {/* {playDefaultHitSFX()} */}
            {!roundSoundsPlayed? playDefaultHitSFX():null}
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