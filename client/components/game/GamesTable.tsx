import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios'

export default function GameTable({
  
  playHeavyClickSFX

}){


///////////////// RENDER RETURN //////////////////////////////
  return(
<div className='bg-red-300'>



<div className="relative overflow-x-auto">

    <table className="w-full text-sm text-left rtl:text-right text-slate-500 dark:text-slate-400">

        <thead className="text-xs text-white uppercase bg-slate-50 dark:bg-slate-700 dark:text-gray-400">
            <tr>
                <th scope="col" className="px-6 py-3">
                    player name
                </th>
                <th scope="col" className="px-6 py-3">
                    status
                </th>
                <th>decline</th>
            
            </tr>
        </thead>
        <tbody>
            <tr className="bg-gray border-b dark:bg-slate-800 dark:border-slate-700">
                <th scope="row" className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap dark:text-white">
                    GuilelessLlama_734
                </th>
                <td className="px-6 py-4">
                    pending
                </td>
                <td className="px-6 py-4">
                <button onClick={()=>{
                      playHeavyClickSFX()
                    }}
                    className='w-8 h-8 aspect-square bg-red-600 hover:bg-red-900 text-text dark:text-darkText border-slate-600 border-2 font-bold text-xs sm:text-sm md:text-base lg:text-lg rounded-full flex justify-center items-center overflow-hidden text-ellipsis focus:ring-4 focus:ring-red-600'>X</button>
                </td>
            
            </tr>
            <tr className="bg-white border-b dark:bg-slate-800 dark:border-slate-700">
                <th scope="row" className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap dark:text-white">
                    Blorkus
                </th>
                <td className="px-6 py-4">
                    active
                </td>
                <td className="px-6 py-4">
                <button onClick={()=>{
                      playHeavyClickSFX()
                    }}
                    className='w-8 h-8 aspect-square bg-red-600 hover:bg-red-900 text-text dark:text-darkText border-slate-600 border-2 font-bold text-xs sm:text-sm md:text-base lg:text-lg rounded-full flex justify-center items-center overflow-hidden text-ellipsis focus:ring-4 focus:ring-red-600'>X</button>
                </td>
           
            </tr>
            <tr className="bg-white dark:bg-slate-800">
                <th scope="row" className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap dark:text-white">
                    lefty_tighty_2020
                </th>
                <td className="px-6 py-4">
                    active
                </td>
                <td className="px-6 py-4">
                <button onClick={()=>{
                      playHeavyClickSFX()
                    }}
                    className='w-8 h-8 aspect-square bg-red-600 hover:bg-red-900 text-text dark:text-darkText border-slate-600 border-2 font-bold text-xs sm:text-sm md:text-base lg:text-lg rounded-full flex justify-center items-center overflow-hidden text-ellipsis focus:ring-4 focus:ring-red-600'>X</button>
                </td>
          
            </tr>
        </tbody>
    </table>
</div>


</div>

    


  )


}