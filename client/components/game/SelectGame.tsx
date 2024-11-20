import React from 'react';
import { useState } from 'react';
import MakeGame from './MakeGame';
import Gameplay from './Gameplay';
import axios from 'axios'

////////////////////////////
import { io } from "socket.io-client";
////////////////////////////

////////////////////////////
//creates front-end socket connection to the server
const socket = io("http://localhost:8080", {
  withCredentials: true,
  extraHeaders: {
    "my-custom-header": "abcd"
  }
});
////////////////////////////




export default function SelectGame(){

  const [playClicked, setPlayClicked] = useState(false)
  //create a state for the room (we'll probably want to make this a combination of both users' unique googleId or something plus an iterating game number?)
    const [session, setSession] = useState("")
  

  const onClickPlay = () =>{
    setPlayClicked(true)


    axios.get('/games')
    .then((response)=>{
      setSession(response.data.sessionId)
    })
    //want to set up a condition to check if there's an available session and otherwise create a new session

    //need to be able to check how many players in a game

    //needs to iterate the session ids for every two players

    setSession("55")
  }

  const onClickMake = () =>{

  }

return(
<>
{!playClicked ?  (<div className='bg-red-300'>

  <h1>Choose!</h1>
  <button className='bg-lime-200' onClick={onClickPlay}>PLAY NOW!</button>
  <button className='bg-lime-400'>CUSTOMIZE!</button>
</div>) : (<Gameplay session={session} socket={socket}/>)}
</>

)

}