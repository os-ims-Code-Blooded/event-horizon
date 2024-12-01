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
  const [gameWinner, setGameWinner] = useState(null)
  const [userDecks, setUserDecks] = useState<any[]>([])
  
  //create a state for the room (we'll probably want to make this a combination of both users' unique googleId or something plus an iterating game number?)
  const [session, setSession] = useState("")
  const [roundNum, setRoundNum] = useState(1)
  
  const [enemyId, setEnemyId] = useState(null)
  
//////////////////////////////////
  useEffect(()=>{

    axios.get(`/profile/decks/${user.id}`)
    .then(response=>{
      
      console.log("USER DECKS", response.data)
  
      setUserDecks(response.data)})

    .catch(err=>console.error(err))
  }, [])
  
  // console.log("USER DECKSSSS", userDecks)



///////////////////////////////////////////


  const onClickPlay = () =>{
    
    axios.post('/games',
      {
        "user_id": user.id
        
      }
    )
    .then((response)=>{

      console.log("!!! user ID", user.id)
      console.log("***Enemy User***\n", response.data.User_Games.filter(game=>game.user_id!== user.id))

      setEnemyId(response.data.User_Games.filter(game=>game.user_id!== user.id).user_id)

      setSession(response.data.id)

      setPlayClicked(true)

      // console.log("***RESPONSE***", response)
      
      // console.log("RESPONSE.DATA", response.data.id)

      axios.get(`/games/rounds/${response.data.id}`)
      .then((moreData)=>{
        console.log(moreData.data)
        setRoundNum(moreData.data['Most Recent Round'])

      })
      .catch(err=>console.error(err))

    })
    .catch(err=>console.error(err))
    

    
  }



///////// MAKE CUSTOM GAME ////////////////////
  const onClickMake = () =>{
    setMakeClicked(true)
  }


////////  DECK SELECT  ///////////////////
const handleDeckSelect = (e) =>{





  axios.get(`/profile/decks/specific/${userDecks[e.target.value].id}`)
    .then((response) => {

      console.log(`Fetching cards for selected deck:`, response);

      const cards = response.data

      setDeckWasChosen(true)
      setDeckSelected(cards)

    })


  axios.patch(`/profile/${user.id}`,
    {
      selectedDeck: {
         connect: {
           id: userDecks[e.target.value].id
          }
        }
      })


}


//////////// RENDER ////////////////////////////

return(

<>


{!playClicked?


<div className='pt-15 flex h-full items-center justify-center min-h-screen bg-slate-900 dark:bg-black'>
  <div className='p-6 justify-items-center flex flex-col items-center'>

<div className='pt-8'>



<select id="deckSelect" onChange={(e)=>{handleDeckSelect(e)}}>
  <option value="">--select deck--</option>




  {userDecks.map((deck, index)=>{
    // console.log("index", index)
    
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
<button className='cursor-not-allowed bg-gray' >PLAY NOW!</button>

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
<GameOver gameWinner={gameWinner} user={user}/>

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
roundNum={roundNum}
enemyId={enemyId}
/>
}
</>
}

</>

)
}