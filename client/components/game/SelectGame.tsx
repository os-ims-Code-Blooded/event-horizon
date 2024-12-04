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
const socket = io("http://localhost:3000", {
  withCredentials: true,
  extraHeaders: {
    "my-custom-header": "abcd"
  }
});

// const socket = io("http://ec2-18-226-17-160.us-east-2.compute.amazonaws.com:3000", {
//   withCredentials: true,
//   extraHeaders: {
//     "my-custom-header": "abcd"
//   }
// });
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
  const [enemyName, setEnemyName] = useState('')

  const [roundInfo, setRoundInfo] = useState([])
  
//////////////////////////////////
  useEffect(()=>{
    axios.get(`/profile/decks/${user.id}`)
    .then(response=>{
      setUserDecks(response.data)})
    .catch(err=>console.error(err))
  }, [])
  
///////////////////////////////////////////


  const onClickPlay = () =>{
    
    axios.post('/games',
      {
        "user_id": user.id
        
      }
    )
    .then((response)=>{

      console.log(" \n REEEEEEESPONSE.DATA: \n", response.data)

      let idOfEnemy = response.data.User_Games.filter(game=>game.user_id!== user.id).user_id

      setEnemyId(idOfEnemy)
      setSession(response.data.id)
      setPlayClicked(true)


     



      axios.get(`/games/rounds/${response.data.id}`)
      .then((moreData)=>{

        console.log("LATEST ROUND:  ", moreData.data["Latest Player Info"])


        // console.log("MORE DATA:  ", moreData.data)

        let enemy = moreData.data["Latest Player Info"].filter(playerInfo=>playerInfo.user_id !== user.id)

        console.log("ENEMY+++++++>\n", enemy[0].name)

        setEnemyName(enemy[0].name)



        setRoundInfo(moreData.data["Latest Player Info"])



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

<div>


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
<div className='h-full'>

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
setRoundNum={setRoundNum}
enemyId={enemyId}
roundInfo={roundInfo}
enemyName={enemyName}
setEnemyName={setEnemyName}
/>
</div>
}
</>
}

</div>

)
}