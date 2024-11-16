import React from 'react';
import { io } from "socket.io-client";
import { useState, useEffect } from 'react';

//creates front-end socket connection to the server
const socket = io("http://localhost:8080");


export default function Gameplay (){
  //creates react hooks for messages sent and received
  const [message, setMessage] = useState("")
  const [messageReceipt, setMessageReceipt] = useState("")

  //create a state for the room (we'll probably want to make this a combination of both users' unique googleId or something plus an iterating game number?)
  const [session, setSession] = useState("")


  const joinSession = () =>{
    if (session !== ""){
      socket.emit("join_session", session)
    }
  }



  //sends a message over the socket
  const sendMessage = () =>{
    //sends the message state
    socket.emit("send_message", { message, session })
  }

  //when the client socket receives a new message, the reveiced message state is updated
  useEffect(()=>{
    socket.on("receive_message", (data)=>{
      console.log(data.message)
      setMessageReceipt(data.message)
    })
  }, [socket])

  //renders an input a button, and a spot for messages
  return (
    <div className='bg-amber-600 margin-left: 15px'>
      <h1>live gameplay</h1>
      <input placeholder='session id' onChange={(e)=>{setSession(e.target.value)}}></input>
      <br></br>
      <br></br>
      <input className='margin-left: 15px' placeholder='message' onChange={(e)=> setMessage(e.target.value)}/>

      <button className='bg-green-900' onClick={sendMessage}>send message</button>

      <h1>log:</h1>
      {messageReceipt}
    </div>
  )
}