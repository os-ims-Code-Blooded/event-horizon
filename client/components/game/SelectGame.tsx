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
  const [handProvided, setHandProvided] = useState([])

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

  const [activeUserGame, setActiveUserGame] = useState(false)

  const [waiting, setWaiting] = useState(false)
  
  

  useEffect( () => {

    // on arrival to this page, attempt to get the decks available
    // this allows the user to select from their current card decks
    axios.get(`/profile/decks/${user.id}`)
      .then((response) => {
        setUserDecks(response.data)

        axios.get(`/games/${user.id}`)
          .then((game) => {
            if (game.data) {

              axios.get(`/games/rounds/${game.data.id}`)
                .then((round) => {
                  setSession(game.data.id);
                  setRoundNum(round.data["Current Round"]);
                  setDeckSelected(round.data["Current Deck"]);
                  setHandProvided(round.data["Current Hand"]);

                  console.log(`Current Deck: `, round.data["Current Deck"]);
                  console.log(`Current Hand: `, round.data["Current Hand"]);

                  socket.emit("join_session", game.data.id, user, round.data["Current Round"]);

                  // I don't know if putting an event listener here is an issue
                  // this might need to be somewhere else?
                  socket.on('session_players', (data: any) => {
            
                    // when we receive emission, see if there is an enemy
                    const enemy = data.filter((player) => {
                      return (player.user_id !== user.id)
                    })
                    
                    console.log("ENEMY???\n", enemy)


                    // if the filtered array contains an enemy
                    if (enemy.length > 0) {
                      setEnemyName(enemy[0].name);  // set that enemy's name
                      setEnemyId(enemy[0].user_id); // set that enemy's user ID
                      setRoundInfo(data)            // set the current round information
                      setWaiting(false)
                      setPlayClicked(true)          // then trigger Game Board conditional render
                      setDeckWasChosen(true)
                    }
                  })
                })
            }
          })
          .catch((err) => {
            console.error(err);
          })

      })
      .catch((err) => { 
        console.error(err)
      })
  }, [])
  




  /*===============================================================================
    This function begins searching for a game; it technically creates a session if
    a session is not found. As a result, we have to use the onClickStopSearch 
    function to request to delete the game and end the "matchmaking" request.
  =================================================================================*/
  const onClickPlay = async () => {
      
    try {


      const game = await axios.post('/games', { "user_id": user.id });
      const round = await axios.get(`/games/rounds/${game.data.id}`);
      
      setSession(game.data.id);
      setRoundNum(round.data["Current Round"]);
      setDeckSelected(round.data["Current Deck"]);
      setHandProvided(round.data["Current Hand"]);
      setWaiting(true)

      console.log(`Current Deck: `, round.data["Current Deck"]);
      console.log(`Current Hand: `, round.data["Current Hand"]);
      

      socket.emit("join_session", game.data.id, user, round.data["Current Round"]);

      // I don't know if putting an event listener here is an issue
      // this might need to be somewhere else?
      socket.on('session_players', (data: any) => {

        // when we receive emission, see if there is an enemy
        const enemy = data.filter((player) => {
          return (player.user_id !== user.id)
        })
        
        if (deckSelected){
        
        }

        console.log("ON CLICK PLAY ENEMY", enemy)
        // if the filtered array contains an enemy
        if (enemy.length > 0) {
          setEnemyName(enemy[0].name);  // set that enemy's name
          setEnemyId(enemy[0].user_id); // set that enemy's user ID
          setRoundInfo(data)            // set the current round information
          setActiveUserGame(true)          // then trigger Game Board conditional render
        }
      })

    } catch (error) {
      console.error(`Error on connecting to a game session.`)
    }
  }
  /*===============================================================================*/
  /*===============================================================================*/



  /*===============================================================================
    This function should enable a user to stop searching for a game (if none found)
  =================================================================================*/
  const onClickStopSearch = async () => {
    try {
      if (session) {
        await axios.delete(`/games/${session}`);
        // we also need to re-enable buttons so they can click play game again
      }
    } catch (error) {
      console.error(`Error on request to stop searching for a game session.`)
    }
  }
  /*===============================================================================*/
  /*===============================================================================*/




  /*===============================================================================
    This function will eventually enable the creation of a custom game
  =================================================================================*/
  const onClickMake = () =>{
    setMakeClicked(true)
  }
  /*===============================================================================*/
  /*===============================================================================*/



  /*===============================================================================
    Handles deck selection for entering a game
  ===============================================================================*/
  const handleDeckSelect = (e) =>{

    /* 
    This should be unnecessary now given how we are managing the states on the
    server side. When you select a deck in here, the server will use this when
    you click play game to create the deck state entry for you on this game.

    axios.get(`/profile/decks/specific/${userDecks[e.target.value].id}`)
      .then((response) => {

        console.log(`Fetching cards for selected deck:`, response);
        
        const cards = response.data
        setDeckWasChosen(true)
        setDeckSelected(cards)
      })
    */

    const sendSelectedDeck = {
      selectedDeck: {
        connect: {
          id: userDecks[e.target.value].id
          }
        }
    }

    setDeckWasChosen(true);

    axios.patch(`/profile/${user.id}`, sendSelectedDeck)
  }
/*===============================================================================*/
/*===============================================================================*/

return(

<div>
{activeUserGame?  

<div className='h-full'>

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
setEnemyId={setEnemyId}
handProvided = {handProvided}
/>
</div>
}
</div>

:  

<div>
 
{!playClicked?


<div className='pt-15 flex h-full items-center justify-center min-h-screen bg-radial-custom dark:bg-black'>
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
<button className='bg-lime-200 rounded-sm' onClick={onClickPlay}>PLAY NOW!</button>

{waiting?

<h1 className="text-white">waiting for game</h1>

:

null

}
<div className='flex flex-row'></div>

<br></br>
</>

:

<>
<button className='cursor-not-allowed bg-gray' >PLAY NOW!</button>

<br></br>
</>
  }
  <button className='bg-lime-400 rounded-sm' onClick={onClickMake}>CUSTOMIZE!</button>
  <br></br>
  <div>

    {!makeClicked?

      null

      :
      <div className='flex flex-row p-4'>


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
setEnemyId={setEnemyId}
handProvided = {handProvided}
/>
</div>
}
</>
}

</div>

}



</div>

)
}