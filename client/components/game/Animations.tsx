import React from 'react';
import { useState, useEffect } from 'react';



export default function Animations({
  enemyName,
  cardToPlay,
  user,
  myPrevRound,
  theirPrevRound,
  turnEnded,

}){


  useEffect(()=>{
    // setTimeout(setRoundSoundsPlayed(true), 10000);
  })
  // console.log("USER PREV ROUND", myPrevRound)
  // console.log("ENEMY PREV ROUND", theirPrevRound)

  return(

    <div className=''>
      {theirPrevRound && myPrevRound && !turnEnded?
      <div className='text-xs p-4'>

      {/* 1 PLAYER BLOCKS, ENEMY FIRES */}
      {myPrevRound[0].action === "BLOCK"  && theirPrevRound[0].action === "FIRE" && theirPrevRound[0].damage?
       <div className='text-xs grid grid-cols-[50%_50%] gap-10 pr-8'>

<div className='flex flex-col h-full w-full text-left p-2 text-white'>
            <div className='text-blue-600 animate-pulse'>BLOCK</div>
            <div className='text-violet-700 animate-ping'>-{theirPrevRound[0].damage / 2}</div>
          </div>

       

          <div className='flex flex-col h-full w-full text-end p-2 text-white'>
          <div className='text-error animate-ping'>FIRE</div>
        </div>
         
        </div>
        :
          null
        }





      {/* 2 PLAYER BLOCKS, ENEMY DEFAULT FIRES */}
      {myPrevRound[0].action === "BLOCK"  && theirPrevRound[0].action === "FIRE" && !theirPrevRound[0].card_id?
      <div className='text-xs grid grid-cols-[50%_50%] gap-10 pr-8'>

<div className='flex flex-col h-full w-full p-2 text-white text-left'>

          <div className='text-blue-600 animate-pulse'>BLOCK</div>
          <div className='p-2'></div>
          <div className='text-violet-700 animate-ping'> -{theirPrevRound[0].damage + 3}</div>
        </div>

       

       
        <div className='flex flex-col h-full w-full p-2 text-white text-center  '>
          <div className='text-error animate-ping align-text-bottom'>FIRE</div>
        </div>

      </div>
        :
          null
        }







      {/* 3 PLAYER BLOCKS, ENEMY BLOCKS */}
      {myPrevRound[0].action === "BLOCK"  && theirPrevRound[0].action === "BLOCK" ?
          <div className='text-xs grid grid-cols-[50%_50%] gap-10 pr-8'>


<div className='flex flex-col h-full w-full text-left p-2 text-white'>
            <div className='text-blue-600 animate-pulse'>BLOCK</div>
          </div>
         
       
          <div className='flex flex-col h-full w-full text-end p-2 text-white'>
            <div className='text-blue-600 animate-pulse align-text-bottom'>BLOCK</div>
          </div>

         </div>
        :
          null
        }




      {/* 4 PLAYER BLOCKS, ENEMY LOADS */}
      {myPrevRound[0].action === "BLOCK"  && theirPrevRound[0].action === "LOAD" ?
           <div className='text-xs grid grid-cols-[50%_50%] gap-10 pr-8'>

<div className='flex flex-col h-full w-full text-left p-2 text-white'>
            <div className='text-blue-600 animate-pulse'>BLOCK</div>
          </div>
         
         
          <div className='flex flex-col h-full w-full text-end p-2 text-white'>
          <div className='text-yellow-300 animate-bounce align-text-bottom'>ENEMY LOADED {theirPrevRound[0].armor ? <>{theirPrevRound[0].armor} ARMOR</>: <> WEAPON</>}</div>
          </div>

         </div>
        :
          null
        }



      {/* 5 PLAYER FIRES WEAPON, ENEMY BLOCK */}
      {myPrevRound[0].action === "FIRE" && myPrevRound[0].damage && myPrevRound[0].card_id  && theirPrevRound[0].action === "BLOCK" ?
           <div className='text-xs grid grid-cols-[50%_50%] gap-10 pr-8'>

<div className='flex flex-col h-full w-full text-left p-2 text-white'>
            <div className='text-error animate-ping'>FIRE</div>
          </div>



          
         <div className='flex flex-col h-full w-full text-end p-2 text-white'>
              <div className='text-blue-600 animate-pulse'>BLOCK</div>
              <div className='text-amber-500 animate-ping'>-{myPrevRound[0].damage / 2}</div>
                        <div className='p-4'></div>
           </div>

         </div>
      :
        null
      }

    {/* 6 PLAYER FIRES WEAPON, ENEMY FIRES WEAPON */}
      {(myPrevRound[0].action === "FIRE" && myPrevRound[0].damage && myPrevRound[0].card_id) && theirPrevRound[0].action === "FIRE" && theirPrevRound[0].damage ?
        
        <div className='text-xs grid grid-cols-[50%_50%] gap-10 pr-8'>


<div className='flex flex-col h-full w-full text-left p-2 text-white'>
                  <div className='text-error animate-ping'>FIRE</div>
                  <div className='text-error animate-ping'>-{theirPrevRound[0].damage}</div>
                </div>

        


               
         <div className='flex flex-col h-full w-full text-end p-2 text-white'>
                  <div className='text-error animate-ping'>FIRE</div>
                  <div className='text-error animate-ping'>  -{myPrevRound[0].damage} </div>
                </div>
        
              </div>
           
      :
        null
      }






    {/* 7 PLAYER FIRES WEAPON, ENEMY FIRES DEFAULT */}
      {(myPrevRound[0].action === "FIRE" && myPrevRound[0].damage && myPrevRound[0].card_id) && theirPrevRound[0].action === "FIRE" && !theirPrevRound[0].damage ?
        
        <div className='text-xs grid grid-cols-[50%_50%] gap-10 pr-8'>


<div className='flex flex-col h-full w-full text-left p-2 text-white'>
                  <div className='text-error animate-ping'>FIRE</div>
                  <div className='text-error animate-ping'>-{theirPrevRound[0].damage + 5}</div>
                </div>

          


                
         <div className='flex flex-col h-full w-full text-end p-2 text-white'>
                  <div className='text-error animate-ping'>FIRE</div>
                  <div className='text-error animate-ping'> -{myPrevRound[0].damage} </div>
                </div>
        
              </div>
           
      :
        null
      }




    {/* 8 PLAYER FIRES WEAPON, ENEMY LOADS */}
      {(myPrevRound[0].action === "FIRE" && myPrevRound[0].damage && myPrevRound[0].card_id) && theirPrevRound[0].action === "LOAD" ?
        
        <div className='text-xs grid grid-cols-[50%_50%] gap-10 pr-8'>


<div className='flex flex-col h-full w-full text-left p-2 text-white'>
                  <div className='text-error animate-ping'>FIRE</div>
                  
                </div>

       


              
         <div className='flex flex-col h-full w-full text-end p-2 text-white'>
                <div className='text-yellow-300 animate-bounce align-text-bottom'>ENEMY LOADED {theirPrevRound[0].armor ? <>{theirPrevRound[0].armor} ARMOR</>: <> WEAPON</>}</div>
                  <div className='text-error animate-ping'> -{myPrevRound[0].damage} </div>
                </div>
        
              </div>
           
      :
        null
      }













    {/* 9 PLAYER FIRES DEFAULT, ENEMY BLOCK */}
      {(myPrevRound[0].action === "FIRE" && !myPrevRound[0].card_id) && theirPrevRound[0].action === "BLOCK" ?
          <div className='text-xs grid grid-cols-[50%_50%] gap-10 pr-8'>


<div className='flex flex-col h-full w-full text-left p-2 text-white'>
             <div className='text-error animate-ping'>FIRE</div>
          </div>



          
         <div className='flex flex-col h-full w-full text-end p-2 text-white'>
            <div className='text-blue-600 animate-pulse'>BLOCK</div>
            <div className='text-amber-500 animate-ping'> -{myPrevRound[0].damage + 3}</div>
          </div>
        </div>
      :
        null
      }













    {/* 10 PLAYER FIRES DEFAULT, ENEMY FIRES WEAPON */}
      {(myPrevRound[0].action === "FIRE" && !myPrevRound[0].card_id) && theirPrevRound[0].action === "FIRE" && theirPrevRound[0].damage ?
         <div className='text-xs grid grid-cols-[50%_50%] gap-10 pr-8'>


<div className='flex flex-col h-full w-full text-left p-2 text-white'>
           <div className='text-error animate-ping'>FIRE</div>
            <div className='text-error animate-ping'>-{theirPrevRound[0].damage}</div>
        </div>

     
        <div className='flex flex-col h-full w-full text-end p-2 text-white'>
          <div className='text-error animate-ping'>FIRE</div>
            <div className='text-error animate-ping'>   -{myPrevRound[0].damage + 5} </div>
         </div>
     
       </div>
      :
        null
      }





    {/* 11 PLAYER FIRES DEFAULT, ENEMY FIRES DEFAULT */}
      {(myPrevRound[0].action === "FIRE" && !myPrevRound[0].card_id) && (theirPrevRound[0].action === "FIRE" && !theirPrevRound[0].card_id) ?
         <div className='text-xs grid grid-cols-[50%_50%] gap-10 pr-8'>


        <div className='flex flex-col h-full w-full text-left p-2 text-white'>
           <div className='text-error animate-ping'>FIRE</div>
            <div className='text-error animate-ping'>-{theirPrevRound[0].damage + 5}</div>
        </div>

         <div className='flex flex-col h-full w-full text-end p-2 text-white'>
          <div className='text-error animate-ping'>FIRE</div>
            <div className='text-error animate-ping'>  -{myPrevRound[0].damage + 5} </div>
         </div>
     
       </div>
      :
        null
      }



    {/* 12 PLAYER FIRES DEFAULT, ENEMY LOADS */}
      {(myPrevRound[0].action === "FIRE" && !myPrevRound[0].card_id) && (theirPrevRound[0].action === "LOAD") ?
        <div className='text-xs grid grid-cols-[50%_50%] gap-10 pr-8'>


<div className='flex flex-col h-full w-full text-left p-2 text-white'>
           <div className='text-error animate-ping'>FIRE</div>
            
        </div>

     
        <div className='flex flex-col h-full w-full text-end p-2 text-white'>
          <div className='text-yellow-300 animate-bounce align-text-bottom'>ENEMY LOADED {theirPrevRound[0].armor ? <>{theirPrevRound[0].armor} ARMOR</>: <> WEAPON</>}</div>
            <div className='text-error animate-ping'>  -{myPrevRound[0].damage + 5} </div>
         </div>
     
       </div>
      :
        null
      }






    {/* 13 PLAYER LOADS, ENEMY BLOCKS */}
      {(myPrevRound[0].action === "LOAD" && theirPrevRound[0].action === "BLOCK") ?
         <div className='text-xs grid grid-cols-[50%_50%] gap-10 pr-8'>


<div className='flex flex-col h-full w-full text-left p-2 text-white'>
           <div className='text-yellow-300 animate-bounce'>LOAD {myPrevRound[0].armor ? <>{myPrevRound[0].armor} ARMOR</>: <>{cardToPlay[0]}</>}</div>
            
        </div>

      
        <div className='flex flex-col h-full w-full text-end p-2 text-white'>
          <div className='text-blue-6 00 animate-pulse align-text-bottom'>BLOCK</div>
         </div>
     
       </div>
      :
        null
      }




    {/* 14 PLAYER LOADS, ENEMY LOADS */}
      {(myPrevRound[0].action === "LOAD" && theirPrevRound[0].action === "LOAD") ?
         <div className='text-xs grid grid-cols-[50%_50%] gap-10 pr-8'>


<div className='flex flex-col h-full w-full text-left p-2 text-white'>
           <div className='text-yellow-300 animate-bounce'>LOAD {myPrevRound[0].armor ? <>{myPrevRound[0].armor} ARMOR</>: <>{cardToPlay[0]}</>}</div>
            
        </div>

        <div className='flex flex-col h-full w-full text-end p-2 text-white'>
         <div className='text-yellow-300 animate-bounce align-text-bottom'>ENEMY LOADED {theirPrevRound[0].armor ? <>{theirPrevRound[0].armor} ARMOR</>: <> WEAPON</>}</div>
         </div>
     
       </div>
      :
        null
      }




    {/* 15 PLAYER LOADS, ENEMY FIRES WEAPON */}
      {(myPrevRound[0].action === "LOAD" && theirPrevRound[0].action === "FIRE" && theirPrevRound[0].damage ) ?
         <div className='text-xs grid grid-cols-[50%_50%] gap-10 pr-8'>


<div className='flex flex-col h-full w-full text-left p-2 text-white'>
           <div className='text-yellow-300 animate-bounce'>LOAD {myPrevRound[0].armor ? <>{myPrevRound[0].armor} ARMOR</>: <>{cardToPlay[0]}</>}</div>
           <div className='text-error animate-ping'>-{theirPrevRound[0].damage}</div>

        </div>

       
        <div className='flex flex-col h-full w-full text-end p-2 text-white'>
         <div className='text-error animate-ping'>FIRE</div>
         </div>
     
       </div>
      :
        null
      }





    {/* 16 PLAYER LOADS, ENEMY FIRES DEFAULT */}
      {(myPrevRound[0].action === "LOAD" && theirPrevRound[0].action === "FIRE" && !theirPrevRound[0].damage ) ?
        <div className='text-xs grid grid-cols-[50%_50%] gap-10 pr-8'>


<div className='flex flex-col h-full w-full text-left p-2 text-white'>
           <div className='text-yellow-300 animate-bounce'>LOAD {myPrevRound[0].armor ? <>{myPrevRound[0].armor} ARMOR</>: <>{cardToPlay[0]}</>}</div>
           <div className='text-error animate-ping'>-{theirPrevRound[0].damage + 5}</div>

        </div>

      
        <div className='flex flex-col h-full w-full text-end p-2 text-white'>
         <div className='text-error animate-ping'>FIRE</div>
         </div>
     
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