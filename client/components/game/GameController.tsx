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

  //player's remaining hit points
  const [hitPoints, setHitPoints] = useState(50)

  //player's remaining hit points
  const [enemyHitPoints, setEnemyHitPoints] = useState(50)

  //the card the player has just selected
  const [cardToPlay, setCardToPlay] = useState(null)

  //the enemy's last action
  const [enemyAction, setEnemyAction] = useState('')

  //the enemy's loaded card
  const [enemyCard, setEnemyCard] = useState('')

  //whether or not player's turn has ended
  const [turnEnded, setTurnEnded] = useState(false)

  //tracks which round we're on
  const [roundNum, setRoundNum] = useState(0)

  //has the card been loaded?
  const [weaponArmed, setWeaponArmed] = useState(false)
  //has the weapon been fired?
  const [weaponFired, setWeaponFired] = useState(false)
  //has the shield been charged?
  const [shieldCharged, setShieldCharged] = useState(false)
  
 ////////////END TURN/////////////////
  const endTurn = () =>{
    //sends the message state
    setTurnEnded(true)
   
    if (weaponArmed){
      socket.emit("end_turn", { playerAction, cardToPlay, session })

    } else {
      socket.emit("end_turn", { playerAction, session })
    }

   //request handling
    // axios.post('/rounds/actions/:action', {
    //   action: playerAction
    // })
    // .then(response=>console.log(response))
    // .catch(err => console.error("failed to post action", err))
    
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
        setCardToPlay={setCardToPlay}
        enemyAction={enemyAction}
        setWeaponArmed={setWeaponArmed}
        hitPoints={hitPoints}
        enemyHitPoints={enemyHitPoints}
        setWeaponFired={setWeaponFired}
        roundNum={roundNum}
        turnEnded={turnEnded}
        />

        <div className='flex flex-row gap-3 justify-center place-items-center'>
          
          <div className=' p-4 bg-purple-900 text-white font-bold' >ACTION SELECTED: {playerAction}</div>
          
          <div className=' p-4 bg-orange-600 text-white font-bold' >ENEMY'S ACTION: {enemyAction}</div>
          
          <div className=' p-4 bg-cyan-900 text-white font-bold' >ENEMY'S CARD: {turnEnded ? enemyCard : null}</div>
       
        </div>


    </div>
  )
}