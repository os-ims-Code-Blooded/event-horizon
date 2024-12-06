import React from 'react';
import { useState } from 'react';

export default function GameOver ({
  gameWinner,
  user
}){



  console.log("USER ID", user.id, "GAME WINNER", gameWinner);

  return(
<>
{gameWinner === user.id? 
    <div className='p-4 justify-items-center flex flex-col items-center bg-radial-custom text-white h-full'>
      <div className='p-4 pt-8 justify-items-center flex flex-col items-center'>
        
        <h1 className='text-xl'>GAME OVER BRUV</h1>
        <h1 className='test-lg'>you won</h1>
        
        <br></br>
        <br></br>

        <button className='p-4 bg-orange-500'>Rematch</button>

        <br></br>
        <br></br>

        <button className='p-4 bg-green-700'>Play New Game</button>

        <br></br>
        <br></br>

        <button className='p-4 bg-indigo-700'>Return to Docking Bay</button>

      </div>
    </div>

: 

<div className='p-4 justify-items-center flex flex-col items-center bg-slate-900 text-white '>
<div className='p-4 pt-8 justify-items-center flex flex-col items-center'>
  
  <h1 className='text-xl'>GAME OVER BRUV</h1>
  <h1 className='test-lg'>you lost</h1>
  
  <br></br>
  <br></br>

  <button className='p-4 bg-orange-500'>Rematch</button>

  <br></br>
  <br></br>

  <button className='p-4 bg-green-700'>Play New Game</button>

  <br></br>
  <br></br>

  <button className='p-4 bg-indigo-700'>Return to Docking Bay</button>

</div>
</div>
}
</>
  )
}