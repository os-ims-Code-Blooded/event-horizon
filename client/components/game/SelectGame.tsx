import React from 'react';
import { useState } from 'react';
import MakeGame from './MakeGame';
import axios from 'axios'

////////////////////////////
import { io } from "socket.io-client";
import GameController from './GameController';
import GameOver from './GameOver.tsx';
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


const decks = [
  {name: "basic deck"},
  {name: "attack deck"},
  {name: "defense deck"}
]


export default function SelectGame(){

  const [playClicked, setPlayClicked] = useState(false)
  const [makeClicked, setMakeClicked] = useState(false)
  const [deckSelected, setDeckSelected] = useState('')

  const [gameOver, setGameOver] = useState(false)
  const [gameWinner, setGameWinner] = useState('')


  //create a state for the room (we'll probably want to make this a combination of both users' unique googleId or something plus an iterating game number?)
    const [session, setSession] = useState("")
  

  const onClickPlay = () =>{
    setPlayClicked(true)


    axios.get('/games')
    .then((response)=>{
      setSession(response.data.sessionId)
    })

    setSession("55")
  }

  const onClickMake = () =>{
    setMakeClicked(true)
  }

  const handleDeckSelect = (e) =>{
    setDeckSelected(e.target.value)
  }

return(
<>


{!playClicked?


<div className='bg-red-300'>
  <div className='p-4 justify-items-center flex flex-col items-center'>


<select id="deckSelect" onChange={(e)=>{handleDeckSelect(e)}}>
  <option value="">--select deck--</option>
  {decks.map(deck=>{
    return(
      <option value={deck.name}>{deck.name}</option>
      

    )
  })}
      </select>

<br></br>

  {deckSelected?

<>
<button className='bg-lime-200' onClick={onClickPlay}>PLAY NOW!</button>

<br></br>
</> 
 
:

<>
<button className='cursor-not-allowed bg-gray-500' >PLAY NOW!</button>

<br></br>
</>
  }
  <button className='bg-lime-400' onClick={onClickMake}>CUSTOMIZE!</button>
  <br></br>
  <div>

    {!makeClicked?
      null
    
      :
      <div>
  
        <MakeGame/>

      </div>
  }
</div>
</div>
</div>


:

<>
{gameOver?
<>
<GameOver gameWinner={gameWinner}/>

</>
:

<GameController
session={session}
socket={socket}
setGameOver={setGameOver}
setGameWinner={setGameWinner}
/>
}
</>
}

</>

)
}