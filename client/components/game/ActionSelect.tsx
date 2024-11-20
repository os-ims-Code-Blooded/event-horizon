import React from 'react';

import { useState, useEffect } from 'react';

import axios from 'axios';

export default function ActionSelect({setPlayerAction}){


  const actionClick = (e) =>{
    console.log("click value", e.target.value)

    setPlayerAction(e.target.value)
    axios.post('/rounds/actions/:action', {
      action: e.target.value
    })
    .then(response=>console.log(response))
    .catch(err => console.error("failed to post action", err))

  }
  return(
    <>
      <div className='flex flex-row gap-3 justify-items-center'>

        <button 
        value='block' 
        className='bg-blue-600 hover:bg-blue-900 text-white font-bold focus:ring-4 focus:ring-blue-300'
        onClick={(e)=>{actionClick(e)}}
        >SHIELDS
        </button>

        <div></div>

        <button 
        value='load' 
        className='bg-yellow-300 hover:bg-yellow-600 text-white font-bold focus:ring-4 focus:ring-yellow-200'
        onClick={(e)=>{actionClick(e)}}
        >RE-ARM
        </button>

        <div></div>

        <button 
        value='shoot' 
        className='bg-red-600 hover:bg-red-900 text-white font-bold focus:ring-4 focus:ring-red-300'
        onClick={(e)=>{actionClick(e)}}
        >CANNONS
        </button>

      </div>
    </>
  )
}