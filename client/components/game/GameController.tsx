import React from 'react';
// import { io } from "socket.io-client";
import { useState, useEffect } from 'react';

import GameBoard from './GameBoard';
import GameOver from './GameOver';
import Navigation from './../Navigation.tsx'


//creates front-end socket connection to the server
// const socket = io("http://localhost:8080", {
//   withCredentials: true,
//   extraHeaders: {
//     "my-custom-header": "abcd"
//   }
// });


export default function GameController ({ session, socket, setGameOver, setGameWinner }){

  //TOP LEVEL GAME COMPONENT

  /////////////STATES//////////////

  //creates react hooks for messages sent and received
  // const [message, setMessage] = useState("")
  // const [messageReceipt, setMessageReceipt] = useState([])

  //player selected action of block, load or fire
  const [playerAction, setPlayerAction] = useState('')
  //player's remaining hit points
  const [hitPoints, setHitPoints] = useState(50)
  //the card the player has just selected
  const [cardToPlay, setCardToPlay] = useState(null)

  //player's remaining hit points
  const [enemyHitPoints, setEnemyHitPoints] = useState(50)


  //the enemy's last action
  const [enemyAction, setEnemyAction] = useState('')
  const [enemyLastAction, setEnemyLastAction] = useState('')

  //did the enemy end their turn?
  const [enemyTurnEnd, setEnemyTurnEnd] = useState(false)
  const [enemyArmed, setEnemyArmed] = useState(false)

  //the enemy's loaded card
  const [enemyCard, setEnemyCard] = useState('')

  //whether or not player's turn has ended
  const [turnEnded, setTurnEnded] = useState(false)

  //tracks which round we're on
  const [roundNum, setRoundNum] = useState(0)

  //is the plater actively loading
  const[activeLoading, setActiveLoading] = useState(false)

  //has the card been loaded?
  const [weaponArmed, setWeaponArmed] = useState(false)

  const [cannonFired, setCannonFired] = useState(false)

  //for a finished game
  // const [gameOver, setGameOver] = useState(false)
  // const [gameWinner, setGameWinner] = useState('')




 ////////////END TURN/////////////////
  const endTurn = () =>{
    //sends the message state
    // setTurnEnded(true)

    // setActiveLoading(false)

    //emits turn for block
    if (playerAction === "block"){
      socket.emit('block_end_turn', {playerAction, turnEnded, session})
    }

    //emits turn for fire
    if (playerAction === "fire"){
      socket.emit('fire_end_turn', {playerAction, cardToPlay, session})
    }

    //emits turn for load
    if (playerAction === "load"){
      socket.emit('load_end_turn', {playerAction, cardToPlay, session})
    }

    if (playerAction === ""){
      socket.emit('lame_end_turn', playerAction, session)
    }


   //////REQUEST HANDLING
    // axios.post('/rounds/actions/:action', {
    //   action: playerAction
    // })
    // .then(response=>console.log(response))
    // .catch(err => console.error("failed to post action", err))
    

  }
///////////CHOOSING ACTIONS/////////////////////////////////////
  const actionClick = (e) =>{
    // console.log("click value", e.target.value)

    setPlayerAction(e.target.value)

    if (e.target.value === 'load' && cardToPlay){
      setWeaponArmed(true)
    } else {
      setWeaponArmed(false)
    }
  }


////////////////LIFECYCLE/////////////////
  //when the client socket receives a new message, the received message state is updated
  useEffect(()=>{

    if (session !== ""){
          socket.emit("join_session", session)
        }

    //UPDATE ACTION
    socket.on('receive_action', (data)=>{
      setEnemyAction(data)
      setEnemyTurnEnd(true)

    })

    //UPDATE CARD
    socket.on('receive_card', (data)=>{
      setEnemyCard(data)
    })

    ////////////for messaging/////////////////////
    // socket.on("receive_message", (data)=>{   //
    //   console.log("DATA MESSAGE:", data)     //
    //   setMessageReceipt(data)                //
    // })                                       //
    //////////////////////////////////////////////
  }, [socket])



  useEffect(()=>{
     //loss condition
    if (hitPoints <= 0 && enemyHitPoints > 0){
     setGameOver(true)
     setGameWinner("Your opponent ")
   }
  
   //win condition
    else if (hitPoints > 0 && enemyHitPoints <= 0){
     setGameOver(true)
     setGameWinner("You ")
   }
  
   //draw condition?
   else if (enemyHitPoints <= 0 && hitPoints <= 0){
     setGameOver(true)
   }
  })


  if (turnEnded && enemyTurnEnd){

    console.log("BOTH TURNS ENDED")

    //you hit them
    if ((enemyAction === 'load' || enemyAction === '') && playerAction === 'fire'){
      setEnemyHitPoints(enemyHitPoints - 20)
      setWeaponArmed(false)

      //they hit you
    } else if (enemyAction === 'fire' && (playerAction === 'load' || playerAction === '')){
      setHitPoints(hitPoints - 20)

      //you hit each-other
    } else if (enemyAction === 'fire' && playerAction === 'fire'){
      setHitPoints(hitPoints - 10)
      setEnemyHitPoints(enemyHitPoints - 10)
    }
    
    
    //end of every turn
    setActiveLoading(false)
    setEnemyLastAction(enemyAction)

    if (enemyAction === 'load'){
      setEnemyArmed(true)
    }
    if (enemyAction === 'fire'){
      setEnemyArmed(false)
    }

    setEnemyAction('')
    setEnemyTurnEnd(false)
    setTurnEnded(false)

    //expend ordinance if fired
    if (playerAction === 'fire'){
      setCardToPlay(null)
    }

    //reset the actions
    setPlayerAction('')

   



}





/////////////RENDER////////////////////////
  //renders an input a button, and a spot for messages
  return (
    <div className='bg-slate-400 pl-4 py-4'>

      <h1>TOP-LEVEL GAME CONTROLLER</h1>

      <>
        <GameBoard
        session={session}
        socket={socket}
        endTurn={endTurn}
        setPlayerAction={setPlayerAction}
        playerAction={playerAction}
        cardToPlay={cardToPlay}
        setCardToPlay={setCardToPlay}

        enemyAction={enemyAction}
        enemyLastAction={enemyLastAction}
        enemyHitPoints={enemyHitPoints}
        enemyCard={enemyCard}
        enemyTurnEnd={enemyTurnEnd}
        enemyArmed={enemyArmed}

        weaponArmed={weaponArmed}
        setWeaponArmed={setWeaponArmed}
        hitPoints={hitPoints}

        roundNum={roundNum}
        turnEnded={turnEnded}
        setTurnEnded={setTurnEnded}
        activeLoading={activeLoading}
        setActiveLoading={setActiveLoading}
        actionClick={actionClick}
        />
      </>


    </div>
  )
}