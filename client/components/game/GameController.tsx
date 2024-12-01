import React from 'react';
// import { io } from "socket.io-client";
import { useState, useEffect } from 'react';

import GameBoard from './GameBoard';
import axios from 'axios';


//creates front-end socket connection to the server
// const socket = io("http://localhost:8080", {
//   withCredentials: true,
//   extraHeaders: {
//     "my-custom-header": "abcd"
//   }
// });


export default function GameController ({ session, socket, setGameOver, setGameWinner, user, userDecks, deckSelected, handSize }){

  //TOP LEVEL GAME COMPONENT

  /////////////STATES//////////////

  //creates react hooks for messages sent and received
  // const [message, setMessage] = useState("")
  // const [messageReceipt, setMessageReceipt] = useState([])

 
  //player selected action of BLOCK, LOAD or FIRE
  const [playerAction, setPlayerAction] = useState('')
  //player's remaining hit points
  const [hitPoints, setHitPoints] = useState(50)
  const [armor, setArmor] = useState(20)
  //the card the player has just selected
  const [cardToPlay, setCardToPlay] = useState(null)

  const [enemyName, setEnemyName] = useState('')

  //player's remaining hit points
  const [enemyHitPoints, setEnemyHitPoints] = useState(50)
  const [enemyArmor, setEnemyArmor] = useState(20)
  

  //the enemy's current and last actions
  const [enemyAction, setEnemyAction] = useState('')
  const [enemyLastAction, setEnemyLastAction] = useState('')

  //did the enemy end their turn?
  const [enemyTurnEnd, setEnemyTurnEnd] = useState(false)

  //is the enemy's weapon armed?
  const [enemyArmed, setEnemyArmed] = useState(false)

  //the enemy's LOADed card
  const [enemyCard, setEnemyCard] = useState('')

  //whether or not player's turn has ended
  const [turnEnded, setTurnEnded] = useState(false)

  //tracks which round we're on
  const [roundNum, setRoundNum] = useState(1)

  //is the plater actively LOADing
  const[activeLoading, setActiveLoading] = useState(false)

  //has the card been LOADed?
  const [weaponArmed, setWeaponArmed] = useState(false)




  //for a finished game
  // const [gameOver, setGameOver] = useState(false)
  // const [gameWinner, setGameWinner] = useState('')


///////////CHOOSING ACTIONS/////////////////////////////////////
  const actionClick = (e) =>{
    // console.log("click value", e.target.value)

    setPlayerAction(e.target.value)

    if (e.target.value === 'LOAD' && cardToPlay){
      setWeaponArmed(true)
    } else {
      setWeaponArmed(false)
    }
  }

 ////////////END TURN/////////////////


  const endTurn = async () =>{


    socket.emit('end_turn', {
      "body":{
        "data": {
          "round_id": roundNum,
          "user_id": user.id,
          "action": playerAction,
          "card_id": cardToPlay[4]
      }

    }, session})


 //emits turn for BLOCK
//  if (playerAction === "BLOCK"){
//   socket.emit('BLOCK_end_turn', {playerAction, turnEnded: true, session})
// }

// //emits turn for FIRE
// if (playerAction === "FIRE"){
//   socket.emit('FIRE_end_turn', {playerAction, cardToPlay, session})
// }

// //emits turn for LOAD
// if (playerAction === "LOAD"){
//   socket.emit('LOAD_end_turn', {playerAction, cardToPlay, turnEnded: true, session})
// }

// if (playerAction === ""){
//   socket.emit('lame_end_turn', playerAction, session)
// }


    /////////// REQUEST HANDLING /////////////////////////

    // await axios.post('/games/rounds', {
    //     'data': {
    //     'round_id': 1,
    //     'user_id': 1,
    //     'action': 'LOAD',
    //     'card_id': 1
    //   }
    // })
    // .then(response=>console.log(response))
    // .catch(err => console.error("failed to post move data", err))


  }


  ////////////////LIFECYCLE/////////////////
  //when the client socket receives a new message, the received message state is updated

  useEffect(()=>{

 
    //join session, sends the user object
    if (session){
      socket.emit("join_session", session, user)
    }
    

    socket.on('received_rounds_data', (data: any)=>{

      console.log("RESPONSE DATA FROM SOCKET", data)

    })

    // socket.on('receive_opponent', (data: any)=>{
   
    //   setEnemyName(data.name)
    

    // })
    // //UPDATE ACTION
    // socket.on('receive_action', (data)=>{

    //   setEnemyAction(data)
    //   setEnemyTurnEnd(true)

    // })



    // //UPDATE CARD
    // socket.on('receive_card', (data)=>{
    //   setEnemyCard(data)
    // })





    ////////////for messaging/////////////////////
    // socket.on("receive_message", (data)=>{   //
    //   console.log("DATA MESSAGE:", data)     //
    //   setMessageReceipt(data)                //
    // })                                       //
    //////////////////////////////////////////////
  }, [socket])

///////////////////////////////////////////////////////
  useEffect(()=>{

  //    //loss condition
  //   if (hitPoints <= 0 && enemyHitPoints > 0){
  //    setGameOver(true)
  //    setGameWinner("Your opponent ")
  //  }
  
  //  //win condition
  //   else if (hitPoints > 0 && enemyHitPoints <= 0){
  //    setGameOver(true)
  //    setGameWinner("You ")
  //  }
  
  //  //draw condition?
  //  else if (enemyHitPoints <= 0 && hitPoints <= 0){
  //    setGameOver(true)

  //  }
  })

/////////////////////////////////////////////////////
  if (turnEnded && enemyTurnEnd){

    setRoundNum(roundNum + 1)

       //end of every turn
       setActiveLoading(false)
       setEnemyLastAction(enemyAction)
   
       if (enemyAction === 'LOAD'){
         setEnemyArmed(true)
       }
       if (enemyAction === 'FIRE'){
         setEnemyArmed(false)
       }
   
       setEnemyAction('')
       setEnemyTurnEnd(false)
       setTurnEnded(false)
   
       //expend ordinance if fired
       if (playerAction === 'FIRE'){
         setCardToPlay(null)
       }
   
       //reset the actions
       setPlayerAction('')
   








    // //you hit them
    // if ((enemyAction === 'LOAD' || enemyAction === '') && playerAction === 'FIRE'){


    //   setEnemyHitPoints(enemyHitPoints - cardToPlay[1])

    //   setWeaponArmed(false)

    //   if (cardToPlay[2] > 0){
    //     setHitPoints(hitPoints + cardToPlay[2])
    //   }


    //   //they hit you
    // } else if (enemyAction === 'FIRE' && (playerAction === 'LOAD' || playerAction === '')){
    //   setHitPoints(hitPoints - enemyCard[1])

    //   if (enemyCard[2] > 0){
    //     setEnemyHitPoints(enemyHitPoints + enemyCard[2])
    //   }


    //   //they FIRE, you BLOCK
    // } else if(enemyAction === 'FIRE' && playerAction === 'BLOCK'){

    //   setHitPoints(hitPoints - enemyCard[1]/2)

    //   if (enemyCard[2] > 0){
    //     setEnemyHitPoints(enemyHitPoints + enemyCard[2])
    //   }


    //   //you FIRE, they BLOCK
    // }else if(playerAction === 'FIRE' && enemyAction === 'BLOCK'){
    //   if (cardToPlay){

    //     if (cardToPlay[1] > 0){
    //       setEnemyHitPoints(enemyHitPoints - cardToPlay[1]/2)
    //     }
        
    //     if (cardToPlay[2] > 0){
    //       setHitPoints(hitPoints + cardToPlay[2])
    //     } 
    //   }




    //   //you hit each-other
    // } else if (enemyAction === 'FIRE' && playerAction === 'FIRE'){


    //   if(cardToPlay[1] > 0 && enemyCard[1] > 0){

    //     setHitPoints(hitPoints - enemyCard[1])
    //     setEnemyHitPoints(enemyHitPoints - cardToPlay[1])
    //   }


    //   if (cardToPlay[2] > 0){
    //     setHitPoints(hitPoints + cardToPlay[2] - enemyCard[1])
    //   } 


    //   if (enemyCard[2] > 0){
    //     setEnemyHitPoints(enemyHitPoints + enemyCard[2] - cardToPlay[1])
    //   }
    // }










 
   



}





/////////////RENDER////////////////////////
  //renders an input a button, and a spot for messages
  return (
    <div className='h-full w-full'>
        <GameBoard
          session={session}
          socket={socket}
          user={user}
          userDecks={userDecks}
          deckSelected={deckSelected}
          handSize={handSize}

          endTurn={endTurn}
          setPlayerAction={setPlayerAction}
          playerAction={playerAction}
          cardToPlay={cardToPlay}
          setCardToPlay={setCardToPlay}

          enemyName={enemyName}
          enemyAction={enemyAction}
          enemyLastAction={enemyLastAction}
          enemyHitPoints={enemyHitPoints}
          enemyArmor={enemyArmor}
          enemyCard={enemyCard}
          enemyTurnEnd={enemyTurnEnd}
          enemyArmed={enemyArmed}

          weaponArmed={weaponArmed}
          setWeaponArmed={setWeaponArmed}
          hitPoints={hitPoints}
          armor={armor}

          roundNum={roundNum}
          turnEnded={turnEnded}
          setTurnEnded={setTurnEnded}
          activeLoading={activeLoading}
          setActiveLoading={setActiveLoading}
          actionClick={actionClick}
          discard={undefined}        />
    </div>
  )
}