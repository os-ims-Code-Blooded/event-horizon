import React from 'react';
import { useState } from 'react';
import FxText from './FxText';

export default function GameOver ({
  gameWinner,
  user
}){



  console.log("USER ID", user.id, "GAME WINNER", gameWinner);

  return(
<div className='mt-15 h-full'>
{gameWinner === user.id? 
    <div className='mt-15 p-4 justify-items-center flex flex-col items-center bg-radial-custom text-white h-full'>
      <div className='p-4 pt-8 justify-items-center flex flex-col items-center h-full'>
        <br></br>
        <br></br>
        <h1 className='text-xl'>GAME OVER</h1>

        <FxText 
        enemyName={undefined} 
        cardToPlay={undefined} 
        user={undefined} 
        myPrevRound={undefined} 
        theirPrevRound={undefined} 
        turnEnded={undefined}/>

        <h1 className='test-lg'>victory is yours</h1>
        
        {/* <br></br>
        <br></br>

        <button className='p-4 bg-orange-500'>Rematch</button>

        <br></br>
        <br></br>

        <button className='p-4 bg-green-700'>Play New Game</button>

        <br></br>
        <br></br>

        <button className='p-4 bg-indigo-700'>Return to Docking Bay</button> */}

      </div>
    </div>

:

<div className='mt-15 p-4 justify-items-center flex flex-col items-center bg-slate-900 text-white h-full '>
<div className='p-4 pt-8 justify-items-center flex flex-col items-center h-full'>
  <br></br>
  <br></br>
  <h1 className='text-xl'>GAME OVER BRUV</h1>
  <h1 className='test-lg'>all is lost</h1>
  
  {/* <br></br>
  <br></br>

  <button className='p-4 bg-orange-500'>Rematch</button>

  <br></br>
  <br></br>

  <button className='p-4 bg-green-700'>Play New Game</button>

  <br></br>
  <br></br>

  <button className='p-4 bg-indigo-700'>Return to Docking Bay</button> */}

</div>
</div>
}
</div>
  )
}