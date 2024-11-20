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

  console.log("TOP LEVEL GAMEPLAY COMPONENT REFRESH!")


  //creates react hooks for messages sent and received
  const [message, setMessage] = useState("")

  const [messageReceipt, setMessageReceipt] = useState([])

  //player selected action of block, load or shoot
  const [playerAction, setPlayerAction] = useState('')

  //player's remaining hit points
  const [hitPoints, setHitPoints] = useState(50)

  //the card the player has just selected
  const [cardToPlay, setCardToPlay] = useState(null)

  const [enemyAction, setEnemyAction] = useState('')

  const [enemyCard, setEnemyCard] = useState('')

  const [turnEnded, setTurnEnded] = useState(false)

  const [weaponArmed, setWeaponArmed] = useState(false)
  

  const endTurn = () =>{
    //sends the message state
    console.log("CARD TO PLAY", cardToPlay)
    setTurnEnded(true)
    
    // axios.post('/rounds/actions/:action', {
    //   action: playerAction
    // })
    // .then(response=>console.log(response))
    // .catch(err => console.error("failed to post action", err))
    if (weaponArmed){
      socket.emit("end_turn", { playerAction, cardToPlay, session })

    } else {

      socket.emit("end_turn", { playerAction, session })
    }

  }




  //when the client socket receives a new message, the received message state is updated
  useEffect(()=>{
    if (session !== ""){
          socket.emit("join_session", session)
        }

    // socket.on("receive_message", (data)=>{
    //   console.log("DATA MESSAGE:", data)
    //   setMessageReceipt(data)
    // })

    socket.on('receive_action', (data)=>{

      console.log("ENEMY ACTION", data)

      setEnemyAction(data)

    })

    socket.on('receive_card', (data)=>{

      console.log("ENEMY ACTION", data)

      setEnemyCard(data)

    })
  }, [socket])



  //renders an input a button, and a spot for messages
  return (
    <div className='bg-amber-600 pl-4 py-4'>

      <h1>TOP-LEVEL GAME CONTROLLER</h1>

        <GameBoard
        session={session}
        socket={socket}
        endTurn={endTurn}
        setPlayerAction={setPlayerAction}
        setCardToPlay={setCardToPlay}
        setWeaponArmed={setWeaponArmed}
        hitPoints={hitPoints}
        />

        <div className='flex flex-row gap-3 justify-center place-items-center'>
          <div >ACTION SELECTED: </div>
          <div>{playerAction}</div>
          <div>ENEMY'S ACTION:</div>
          <div> {turnEnded ? enemyAction : null}</div>
          <div>ENEMY'S CARD:</div>
          <div> {turnEnded ? enemyCard : null}</div>
        </div>


    </div>
  )
}