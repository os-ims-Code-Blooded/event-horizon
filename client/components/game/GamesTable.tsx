import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios'

export default function GameTable({

  playHeavyClickSFX,
  userInvites,
  userAcceptedInvs,
  acceptedOutgoingInvs,

  setUserAcceptedInvs,
  setUserInvites,
  socket,

  setSession,
  setRoundNum,
  setDeckSelected,
  setHandProvided,
  setRoundActual,

  setEnemyName,
  setEnemyId,
  setActiveUserGame,
  setRoundInfo,
  deckSelected,
  decl,

  user,

  
  declineInv,
  setShowPrivateModal,
  setPrivateGameID,
  joinPrivateGame,

  openGames,
  setPlayClicked

}){

 

///////////////// RENDER RETURN //////////////////////////////
  return(
<div className='bg-red-300 w-full'>



<div className="relative overflow-x-auto">






    <table className="text-sm text-left rtl:text-right text-slate-500 dark:text-slate-400 px-2 justify-between">



        <thead className="text-xs text-white uppercase bg-slate-50 dark:bg-slate-700 dark:text-gray-400">
            <tr className='justify-between p-2'>
                <th scope="col" className="px-6 py-3">
                    player name
                </th>
                <th scope="col" className="px-6 py-3">
                    status
                </th>
                <th>select game</th>
                <th className='text-end pr-4'>decline</th>

            </tr>
        </thead>



        <tbody>

{/* ////////////////////////////////////// PUBLIC GAMES /////////////////////////////////////// */}

        {userInvites.map((invite)=>{

          return(
            <tr className="bg-gray border-b dark:bg-slate-800 dark:border-slate-700">
                <th scope="row" className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap dark:text-white">
                    {invite.invitee.name}
                </th>
                <td className="px-6 py-4">
                    {invite.accepted? <p>accepted</p>: <p>pending</p>}
                </td>
                <td className="px-6 py-4">



                <button onClick={()=>{
                      playHeavyClickSFX()
                      setPrivateGameID(invite.game_id)
                      setShowPrivateModal(true)
                    }}
                    className='w-8 h-8 aspect-square bg-darkGreen hover:bg-green-900 text-text dark:text-darkText border-slate-600 border-2 font-bold text-xs sm:text-sm md:text-base lg:text-lg rounded-full flex justify-center items-center overflow-hidden text-ellipsis focus:ring-4 focus:ring-darkGreen'>✓</button>
               
               
               
                </td>
                <td className="px-6 py-4">
                <button onClick={()=>{
                      playHeavyClickSFX()
                      declineInv(invite.game_id)
                    }}
                    className='w-8 h-8 aspect-square bg-error hover:bg-red-900 text-text dark:text-darkText border-slate-600 border-2 font-bold text-xs sm:text-sm md:text-base lg:text-lg rounded-full flex justify-center items-center overflow-hidden text-ellipsis focus:ring-4 focus:ring-error'>X</button>
                </td>
            </tr>

          )

        })}




{/* ///////////////////////////////////// PRIVATE GAMES //////////////////////////////////////// */}


         {openGames.map((invite)=>{
          return(

            <tr className="bg-gray border-b dark:bg-slate-800 dark:border-slate-700">


          {invite.from !== user.id?
                <th scope="row" className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap dark:text-white">
                    {invite.invitee.name}
                </th>
          :
                <th scope="row" className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap dark:text-white">
                       {invite.invitedTo.name}
                </th>

         }

                <td className="px-6 py-4">
                    {invite.accepted? <p>accepted</p>: <p>pending</p>}
                </td>
                <td className="px-6 py-4">


                <button onClick={()=>{
                      playHeavyClickSFX()
                      joinPrivateGame(invite.game_id)
                      // setPrivateGameID(invite.game_id)
                      // setShowPrivateModal(true)

                    }}


                    className='w-8 h-8 aspect-square bg-darkGreen hover:bg-green-900 text-text dark:text-darkText border-slate-600 border-2 font-bold text-xs sm:text-sm md:text-base lg:text-lg rounded-full flex justify-center items-center overflow-hidden text-ellipsis focus:ring-4 focus:ring-darkGreen'>✓</button>



                </td>
                <td className="px-6 py-4">
              </td>
            </tr>

        )

        })}





        </tbody>



    </table>







</div>


</div>

    


  )


}