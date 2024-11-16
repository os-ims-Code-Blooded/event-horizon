import React from 'react';
import { io } from "socket.io-client";
import { useState, useEffect } from 'react';

//creates front-end socket connection to the server
const socket = io("http://localhost:8080");


export default function Gameplay (){
  //creates react hooks for messages sent and received
  const [message, setMessage] = useState("")
  const [messageReceipt, setMessageReceipt] = useState("")

  //sends a message over the socket
  const sendMessage = () =>{
    //sends the message state
    socket.emit("send_message", { message })
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
      <input className='margin-left: 15px' placeholder='message' onChange={(e)=> setMessage(e.target.value)}/>

      <button onClick={sendMessage}>send message</button>

      <h1>log:</h1>
      {messageReceipt}
    </div>
  )
}