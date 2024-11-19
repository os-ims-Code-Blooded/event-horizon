import React from 'react';
import { io } from "socket.io-client";
import { useState, useEffect } from 'react';

//creates front-end socket connection to the server
const socket = io("http://localhost:8080", {
  withCredentials: true,
  extraHeaders: {
    "my-custom-header": "abcd"
  }
});


export default function Gameplay ({ session }){

  console.log("GAMEPLAY COMPONENT!")
  //creates react hooks for messages sent and received
  const [message, setMessage] = useState("")
  const [messageReceipt, setMessageReceipt] = useState([])

  
    // const [session, setSession] = useState("")


  // const joinSession = () =>{
  // console.log("SESSION ID", session)
  //   if (session !== ""){
  //     socket.emit("join_session", session)
  //   }
  // }



  //sends a message over the socket
  const sendMessage = () =>{
    //sends the message state
    socket.emit("send_message", { message, session })
  }

  //when the client socket receives a new message, the received message state is updated



  useEffect(()=>{
    if (session !== ""){
          socket.emit("join_session", session)
        }

    socket.on("receive_message", (data)=>{
      console.log("DATA MESSAGE:", data)
      setMessageReceipt(data)
    })
  }, [socket])



  //renders an input a button, and a spot for messages
  return (
    <div className='bg-amber-600 pl-4 py-4'>

      <h1>live gameplay</h1>

      <canvas className='bg-slate-300' width={480} height={320}>

      </canvas>

      {/* <br></br>
      <br></br>
      <input placeholder='session id' onChange={(e)=>{setSession(e.target.value)}}></input>
      <button className='bg-blue-700' onClick={joinSession}>join session</button> */}

      <br></br>
      <br></br>

      <input className='margin-left: 15px' placeholder='message' onChange={(e)=> setMessage(e.target.value)}/>

      <button className='bg-green-900' onClick={sendMessage}>send message</button>

        <br></br>
        <br></br>
      <div className='bg-slate-300 w-64'>

        <h1>log:</h1>
        {messageReceipt.map(message=>{
          return (
            <h3>{message}</h3>
          )
        })}
    
      </div>

    </div>
  )
}