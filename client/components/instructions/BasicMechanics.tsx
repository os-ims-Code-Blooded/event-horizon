import React, { FC, useEffect, useState } from 'react';
import { GiRosaShield } from "react-icons/gi";
import { GiMachineGunMagazine } from "react-icons/gi";
import { GiRocket } from "react-icons/gi";

const BasicMechanics = () => {

  return (
    <div id='basicMechanics' style={{ width: "80%"}}>
    
      {/* This section will display all buttons contained in one row, with very brief description */}
      <div id='basicMechanics-Overview'>

        <span className='grid grid-cols-3 gap-4 justify-items-center items-center pb-4' style={{width: "100%"}}>
          <p>BLOCK</p>
          <p>LOAD</p>
          <p>FIRE</p>
        </span>

        {/* Buttons for overview */}
        <span className='grid grid-cols-3 gap-4 justify-items-center items-center' style={{width: "100%"}}>
          <button
            value='BLOCK'
            className='h-20 w-20 aspect-square bg-blue-600 hover:bg-blue-900 border-slate-600 border-2 text-text dark:text-darkText font-bold text-xs sm:text-sm md:text-base lg:text-lg rounded-full justify-center items-center justify-items-center overflow-hidden text-ellipsis focus:ring-4 focus:ring-blue-600'
          >
            <GiRosaShield style={{fontSize: 50, pointerEvents: "none"}} />
          </button>
          <button
            value='LOAD'
            className='h-20 w-20 aspect-square bg-yellow-300 hover:bg-yellow-600 border-slate-600 border-2 text-text dark:text-darkText font-bold text-xs sm:text-sm md:text-base lg:text-lg rounded-full justify-center items-center justify-items-center overflow-hidden text-ellipsis focus:ring-4 focus:ring-yellow-300'
          >
            <GiMachineGunMagazine style={{fontSize: 50, pointerEvents: "none"}} />
          </button>
          <button
            value='FIRE'
            className='h-20 w-20 aspect-square bg-red-600 hover:bg-red-900 text-text dark:text-darkText border-slate-600 border-2 font-bold text-xs sm:text-sm md:text-base lg:text-lg rounded-full justify-center items-center justify-items-center overflow-hidden text-ellipsis focus:ring-4 focus:ring-red-600'
          >
            <GiRocket style={{fontSize: 50, transform: "rotate(270deg)", pointerEvents: "none"}}/>
          </button>
        </span>

      </div>

      {/* This section will cover the BLOCK button specifically */}
      <div id='basicMechanics-BLOCK' className='flex flex-row p-12'>
        
        <div className='justify-items-center items-center justify-center flex' style={{minWidth: "15%"}}>
          <button
            value='BLOCK'
            className='h-20 w-20 min-h-20 min-w-20 aspect-square bg-blue-600 hover:bg-blue-900 border-slate-600 border-2 text-text dark:text-darkText 
            font-bold text-xs sm:text-sm md:text-base lg:text-lg rounded-full justify-center items-center justify-items-center overflow-hidden 
            text-ellipsis focus:ring-4 focus:ring-blue-600'
          >
            <GiRosaShield style={{fontSize: 50, pointerEvents: "none"}} />
          </button>
        </div>
        <p className='pl-8'>
          The block mechanism is one of the most important functions that your ship is capable of performing.
          Whenever a ship attempts to block, it enables active shielding that will reduce incoming damage by 50%
          regardless of the current armor that the ship possesses. However, it's important to note that shielding
          consumes significant power...as a result your ship is unable to perform any actions on the same turn.
        </p>
      </div>

      {/* This section will cover the LOAD button specifically, it will be interactive with cards */}
      <div id='basicMechanics-LOAD' className='flex flex-row p-12'>
        
        <div className='justify-items-center items-center justify-center flex' style={{minWidth: "15%"}}>
          <button
            value='BLOCK'
            className='h-20 w-20 min-h-20 min-w-20 aspect-square bg-blue-600 hover:bg-blue-900 border-slate-600 border-2 text-text dark:text-darkText 
            font-bold text-xs sm:text-sm md:text-base lg:text-lg rounded-full justify-center items-center justify-items-center overflow-hidden 
            text-ellipsis focus:ring-4 focus:ring-blue-600'
          >
            <GiRosaShield style={{fontSize: 50, pointerEvents: "none"}} />
          </button>
        </div>
        <p className='pl-8'>
          The block mechanism is one of the most important functions that your ship is capable of performing.
          Whenever a ship attempts to block, it enables active shielding that will reduce incoming damage by 50%
          regardless of the current armor that the ship possesses. However, it's important to note that shielding
          consumes significant power...as a result your ship is unable to perform any actions on the same turn.
        </p>
      </div>

      {/* This section will cover the FIRE button specifically, it could be semi-interactive */}
      <div id='basicMechanics-FIRE' className='flex flex-row p-12'>
        
        <div className='justify-items-center items-center justify-center flex' style={{minWidth: "15%"}}>
          <button
            value='BLOCK'
            className='h-20 w-20 min-h-20 min-w-20 aspect-square bg-blue-600 hover:bg-blue-900 border-slate-600 border-2 text-text dark:text-darkText 
            font-bold text-xs sm:text-sm md:text-base lg:text-lg rounded-full justify-center items-center justify-items-center overflow-hidden 
            text-ellipsis focus:ring-4 focus:ring-blue-600'
          >
            <GiRosaShield style={{fontSize: 50, pointerEvents: "none"}} />
          </button>
        </div>
        <p className='pl-8'>
          The block mechanism is one of the most important functions that your ship is capable of performing.
          Whenever a ship attempts to block, it enables active shielding that will reduce incoming damage by 50%
          regardless of the current armor that the ship possesses. However, it's important to note that shielding
          consumes significant power...as a result your ship is unable to perform any actions on the same turn.
        </p>
      </div>

    </div>
  )

}

export default BasicMechanics;
