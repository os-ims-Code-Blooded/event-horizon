import React from 'react';
// import { io } from "socket.io-client";
import { useState, useEffect } from 'react';
import ActionSelect from './ActionSelect';
import GameBoard from './GameBoard';
import axios from 'axios';


//creates front-end socket connection to the server
// const socket = io("http://localhost:8080", {
//   withCredentials: true,
//   extraHeaders: {
//     "my-custom-header": "abcd"
//   }
// });


export default function GameController ({ session, socket }){

  //TOP LEVEL GAME COMPONENT

  /////////////STATES//////////////

  //creates react hooks for messages sent and received
  // const [message, setMessage] = useState("")
  // const [messageReceipt, setMessageReceipt] = useState([])

  //player selected action of block, load or shoot
  const [playerAction, setPlayerAction] = useState('')

  const [prevAction, setPrevAction] = useState('')

  //player's remaining hit points
  const [hitPoints, setHitPoints] = useState(50)

  //player's remaining hit points
  const [enemyHitPoints, setEnemyHitPoints] = useState(50)

  //the card the player has just selected
  const [cardToPlay, setCardToPlay] = useState(null)

  //the enemy's last action
  const [enemyAction, setEnemyAction] = useState('')
  const [enemyLastAction, setEnemyLastAction] = useState('')

  //did the enemy end their turn?
  const [enemyTurnEnd, setEnemyTurnEnd] = useState(false)

  //the enemy's loaded card
  const [enemyCard, setEnemyCard] = useState('')

  //whether or not player's turn has ended
  const [turnEnded, setTurnEnded] = useState(false)

  //tracks which round we're on
  const [roundNum, setRoundNum] = useState(0)

  
  const[activeLoading, setActiveLoading] = useState(false)

  //has the card been loaded?
  const [weaponArmed, setWeaponArmed] = useState(false)
  //has the weapon been fired?
  const [weaponFired, setWeaponFired] = useState(false)
  //has the shield been charged?
  const [shieldCharged, setShieldCharged] = useState(false)
  


 ////////////END TURN/////////////////
  const endTurn = () =>{
    //sends the message state
    // setTurnEnded(true)

    // setActiveLoading(false)

    //emits turn for block
    if (playerAction === "block"){
      socket.emit('block_end_turn', {playerAction, turnEnded, session})
    }





    //emits turn for shoot
    if (playerAction === "shoot"){
      socket.emit('shoot_end_turn', {playerAction, cardToPlay, session})



      // setWeaponArmed(false)
      // setWeaponFired(false)
      // setCardToPlay(null)
    }





    //emits turn for load
    if (playerAction === "load"){
      socket.emit('load_end_turn', {playerAction, cardToPlay, session})
    }

    if (playerAction === ""){
      socket.emit('lame_end_turn', playerAction, session)
    }


    // if (weaponArmed){
    //   socket.emit("end_turn", { playerAction, cardToPlay, session })

    // } else {
    //   socket.emit("end_turn", { playerAction, session })
    // }

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

    if (e.target.value === 'shoot'){
      setWeaponFired(true)
    } else {
      setWeaponFired(false)
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

      // if (enemyAction === 'shoot' && playerAction === 'load'){
      //   setHitPoints(hitPoints - 10);
      // }

    })

    //UPDATE CARD
    socket.on('receive_card', (data)=>{
      setEnemyCard(data)
    })


    
    //for messaging
    // socket.on("receive_message", (data)=>{
    //   console.log("DATA MESSAGE:", data)
    //   setMessageReceipt(data)
    // })


  }, [socket])
  
  
  
  if (turnEnded && enemyTurnEnd){
    console.log("BOTH TURNS ENDED")

    if ((enemyAction === 'load' || enemyAction === '') && playerAction === 'shoot'){
      setEnemyHitPoints(enemyHitPoints - 20)
    } else if (enemyAction === 'shoot' && (playerAction === 'load' || playerAction === '')){
      setHitPoints(hitPoints - 20)
    } else if (enemyAction === 'shoot' && playerAction === 'shoot'){
      setHitPoints(hitPoints - 10)
      setEnemyHitPoints(enemyHitPoints - 10)
    }

    setActiveLoading(false)
    setEnemyLastAction(enemyAction)
    setEnemyAction('')
    setEnemyTurnEnd(false)
    setTurnEnded(false)
    if (playerAction === 'shoot'){
      setCardToPlay(null)
    }
    setPlayerAction('')
    
  }

/////////////RENDER////////////////////////
  //renders an input a button, and a spot for messages
  return (
    <div className='bg-amber-600 pl-4 py-4'>

      <h1>TOP-LEVEL GAME CONTROLLER</h1>

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
        weaponArmed={weaponArmed}
        setWeaponArmed={setWeaponArmed}
        hitPoints={hitPoints}
        enemyHitPoints={enemyHitPoints}
        setWeaponFired={setWeaponFired}
        roundNum={roundNum}
        turnEnded={turnEnded}
        setTurnEnded={setTurnEnded}
        activeLoading={activeLoading}
        setActiveLoading={setActiveLoading}
        actionClick={actionClick}
        />

        <div className='flex flex-row gap-3 justify-center place-items-center'>
          
          <div className=' p-4 bg-purple-900 text-white font-bold' >ACTION SELECTED: {playerAction}</div>
          
          <div className=' p-4 bg-orange-600 text-white font-bold' >ENEMY'S ACTION: {enemyAction}</div>
          
          <div className=' p-4 bg-cyan-900 text-white font-bold' >ENEMY'S CARD: {turnEnded ? enemyCard : null}</div>
       
        </div>


    </div>
  )
}