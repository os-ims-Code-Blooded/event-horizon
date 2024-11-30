import React from 'react';
import { useState } from 'react';
import MakeGame from './MakeGame';
import axios from 'axios'
import { useEffect } from 'react';

////////////////////////////
import { io } from "socket.io-client";
import GameController from './GameController';
import GameOver from './GameOver.tsx';
import UserDecks from './../cards/UserDecks.tsx'
import { use } from 'passport';
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



export default function SelectGame({
  user
}){
  
  
  const [playClicked, setPlayClicked] = useState(false)
  const [makeClicked, setMakeClicked] = useState(false)
  const [deckSelected, setDeckSelected] = useState([])
  const [deckWasChosen, setDeckWasChosen] = useState(false)

  const [handSize, setHandSize] = useState(3)
  
  const [gameOver, setGameOver] = useState(false)
  const [gameWinner, setGameWinner] = useState('')
  const [userDecks, setUserDecks] = useState<any[]>([])
  
  //create a state for the room (we'll probably want to make this a combination of both users' unique googleId or something plus an iterating game number?)
  const [session, setSession] = useState("")
  
//////////////////////////////////
  useEffect(()=>{

    axios.get(`/profile/decks/${user.id}`)
    .then(response=>{
      
      // console.log("USER DECK", response.data)
  
      setUserDecks(response.data)})

    .catch(err=>console.error(err))
  }, [])
  
  // console.log("USER DECKSSSS", userDecks)
//////////////////
  const onClickPlay = () =>{
    setPlayClicked(true)


    axios.post('/games',
      {
        "user_id": user.id

      }
    )
    .then((response)=>{
      // console.log("RESPONSE.DATA", response.data)
      setSession(response.data.id)
    })
    .catch(err=>console.error(err))

  }
/////////////////////////////
  const onClickMake = () =>{
    setMakeClicked(true)
  }
////////DECK SELECT///////////////////
  const handleDeckSelect = (e) =>{


    // console.log("DECK EVENT", userDecks[e.target.value].User_Decks_Cards)
  

    setDeckSelected(userDecks[e.target.value].User_Decks_Cards)
    setDeckWasChosen(true)


    axios.patch(`/profile/${user.id}`,
      {
        selectedDeck: {
           connect: {
             id: 1
            }
          }
        })


  }

return(

<>


{!playClicked?


<div className='flex items-center justify-center min-h-screen bg-slate-900 dark:bg-black h-screen'>
  <div className='p-6 justify-items-center flex flex-col items-center'>

<div className='pt-8'>



<select id="deckSelect" onChange={(e)=>{handleDeckSelect(e)}}>
  <option value="">--select deck--</option>




  {userDecks.map((deck, index)=>{
    console.log("index", index)
    
    return(
      <option key={deck.deck_name} value={index}>{deck.deck_name}</option>


    )
  })}






</select>
  </div>

<br></br>

  {deckWasChosen?

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
      
      <UserDecks user={null}/>
    
      :
      <div className='flex flex-row p-4'>
  
        <UserDecks user={null}/>
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
user={user}
setGameOver={setGameOver}
setGameWinner={setGameWinner}
userDecks={userDecks}
deckSelected={deckSelected}
handSize={handSize}
/>
}
</>
}

</>

)
}