import React from 'react';
import { useState } from 'react';

export default function MakeGame(){

  const [cardSlots, setCardSlots] = useState(1)

  const handleCardSlots = (e) =>{
    console.log(e.target.value)
  }

  return(

    <div className='bg-stone-500 p-4'>
      <h1 className='text-white text-lg justify-center flex flex-col items-center'>Custom Game Settings</h1>
      <form className='p-4 '>


       <input
       id="checkbox-2"
       type="checkbox"
       value="GQSL"
      //  onSelect={()=> }
       className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
       ></input>
      <label
      htmlFor="checkbox-2"
      className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
        GORLAKX QUASAR SLIME CANNON
      </label>

      <br></br>
      <br></br>

      <select id="cardSlots" onChange={(e)=>{handleCardSlots(e)}}>
        <option value="1">1</option>
        <option value="3">3</option>
        <option value="5">5</option>
      </select>

      <label
      htmlFor="cardSlots"
      className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
        Armory Slots
      </label>

      <br></br>
      <br></br>

      <select id="loadSlots" onChange={(e)=>{handleCardSlots(e)}}>
        <option value="1">1</option>
        <option value="2">2</option>
      </select>

      <label
      htmlFor="loadSlots"
      className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
        Cannon Slots
      </label>

      <br></br>
      <br></br>

      <select id="shieldPower" onChange={(e)=>{handleCardSlots(e)}}>
        <option value="100">100%</option>
        <option value="75">75%</option>
        <option value="50">50%</option>
        <option value="25">25%</option>
      </select>

      <label
      htmlFor="shieldPower"
      className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
        Shield Power
      </label>


      <br></br>
      <br></br>

      <select id="maxHp" onChange={(e)=>{handleCardSlots(e)}}>
        <option value="50">50</option>
        <option value="100">100</option>
        <option value="150">150</option>
        <option value="200">200</option>
      </select>

      <label
      htmlFor="maxHp"
      className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
        Starting Hit Points
      </label>

      <br></br>
      <br></br>

      <input
       id="checkbox-3"
       type="checkbox"
       value="openGame"
      //  onSelect={()=> }
       className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
       ></input>
      <label
      htmlFor="checkbox-2"
      className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
        Open Invitation
      </label>

      <br></br>
      <br></br>
      
      <input type='search' placeholder='invite friend'></input>
      
      <br></br>
      <br></br>

      <button className='p-2 bg-emerald-500  hover:bg-emerald-900 text-white font-bold focus:ring-4 focus:ring-emerald-600 '>ENGAGE!</button>

      </form>

      <br></br>

      <div></div>
    </div>

  )
}