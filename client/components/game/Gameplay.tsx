import React from 'react';
// import { io } from "socket.io-client";
import { useState, useEffect } from 'react';
import ActionSelect from './ActionSelect';

//creates front-end socket connection to the server
// const socket = io("http://localhost:8080", {
//   withCredentials: true,
//   extraHeaders: {
//     "my-custom-header": "abcd"
//   }
// });


export default function Gameplay ({ session, socket }){

  console.log("GAMEPLAY COMPONENT REFRESH!")


  //creates react hooks for messages sent and received
  const [message, setMessage] = useState("")

  const [messageReceipt, setMessageReceipt] = useState([])

  //player selected action of block, load or fire
  const [playerAction, setPlayerAction] = useState('')

  //player's remaining hit points
  const [hitPoints, setHitPoints] = useState(10)

  //the card the player has just selected
  const [cardToPlay, setCardToPlay] = useState(null)

  const [enemyAction, setEnemyAction] = useState('')

  



  // const [session, setSession] = useState("")

  // const joinSession = () =>{
  // console.log("SESSION ID", session)
  //   if (session !== ""){
  //     socket.emit("join_session", session)
  //   }
  // }





  //sends a message over the socket
  // const sendMessage = () =>{
  //   //sends the message state
  //   socket.emit("send_message", { message, session })
  // }
  const endTurn = () =>{
    //sends the message state
    
    socket.emit("end_turn", { playerAction, cardToPlay, session })
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

    socket.on('receive_turn', (data)=>{
      console.log("PLAYER ACTIONS", data)
      setEnemyAction(data.playerAction)

    })
  }, [socket])








  //renders an input a button, and a spot for messages
  return (
    <div className='bg-amber-600 pl-4 py-4'>

      <h1>GAME</h1>


        <ActionSelect setPlayerAction={setPlayerAction} />
        <div>ACTION SELECTED: {playerAction}</div>
      <br></br>
      <br></br>

      {/* <input className='margin-left: 15px' placeholder='message' onChange={(e)=> setMessage(e.target.value)}/> */}

      {/* <button className='bg-green-900' onClick={sendMessage}>send message</button> */}
      <button 
      className='bg-emerald-500  hover:bg-emerald-900 text-white font-bold focus:ring-4 focus:ring-emerald-600' 
      onClick={endTurn}>COMMIT TURN
      </button>

        <br></br>
        <br></br>
        <h1>ENEMY'S ACTIONS: {enemyAction}</h1>
        
        <br></br>
        <br></br>
      {/* <div className='bg-slate-300 w-64'>

        <h1>log:</h1>
        {messageReceipt.map(message=>{
          return (
            <h3>{}</h3>
          )
        })}
    
      </div> */}

    </div>
  )
}