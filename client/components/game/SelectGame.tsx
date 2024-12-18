import React from 'react';
import { useState } from 'react';
import MakeGame from './MakeGame';
import axios from 'axios'
import { useEffect } from 'react';

////////////////////////////
import { io } from "socket.io-client";
import GameController from './GameController';
import GameOver from './GameOver.tsx';
import GameTable from './GamesTable.tsx';
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

// const socket = io("https://eventhorizongame.live", {
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
  user,
  volume,
  playMusic,
  click13,
  click6,
  playHeavyClickSFX,
  musicPlayed,
  setMusicPlayed,
  userInvites,
  setUserAcceptedInvs,
  setUserInvites

}){

  console.log(userInvites)

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

  const [roundActual, setRoundActual] = useState(1)

  const [enemyId, setEnemyId] = useState(null)
  const [enemyName, setEnemyName] = useState('')

  const [roundInfo, setRoundInfo] = useState([])

  const [activeUserGame, setActiveUserGame] = useState(false)

  const [waiting, setWaiting] = useState(false)

  const opponentCards = [
    {
    },
    {
    },
    {
    },
  ];

  const [enemyHand, setEnemyHand] = useState(opponentCards)


  if (!musicPlayed){
    playMusic();
    // console.log('music played');
    setMusicPlayed(true)
  } 
  
  
  useEffect( () => {
    
    // on arrival to this page, attempt to get the decks available
    // this allows the user to select from their current card decks
    axios.get(`/profile/decks/${user.id}`)
      .then((response) => {
        setUserDecks(response.data)
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
      setRoundActual(round.data["Current Round Actual"])

      // console.log(`******** Current ROUND DATA: `, round.data);
      // console.log(`Current Deck: `, round.data["Current Deck"]);
      // console.log(`Current Hand: `, round.data["Current Hand"]);


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

        // console.log("ON CLICK PLAY ENEMY", enemy)
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
    click13()
    try {
      if (session) {
        await axios.delete(`/games/${session}`);
        setWaiting(false)
        setPlayClicked(false) 
        setDeckWasChosen(false)
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
    click13()

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

  <div className='max-h-full max-w-full'>
    <div className='bg-starfield-light dark:bg-starfield inset-0 z-9 absolute'></div>





    {activeUserGame?
    <div className='h-full z-10 relative'>
      {gameOver?
      <>
        <GameOver volume={volume} gameWinner={gameWinner} user={user}/>
      </>
        :
        <div className='h-full z-10 relative'>
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
           enemyHand={enemyHand}
           setEnemyHand={setEnemyHand}
           roundActual={roundActual}
           setRoundActual={setRoundActual}
           volume={volume}
          />
          </div>
          }
    </div>

    :
    

    
    <div className='z-10 relative'>



      {!playClicked?
      <div className='pt-20 flex h-full items-center justify-center min-h-screen z-10 relative'>





        <div className='bg-starfield-light dark:bg-starfield inset-0 z-9 absolute'> </div>
        <div className='p-6 justify-items-center flex flex-col items-center gap-3 z-10 relative'>
                <div className='pt-8 z-10 relative'>
                  <select className='text-text dark:text-darkText bg-slate-200 dark:bg-slate-700 w-70 z-10 relative' id="deckSelect" onClick={()=>{click13()}} onChange={(e)=>{
                    handleDeckSelect(e)}}>
                    <option className='text-text dark:text-darkText bg-slate-200 dark:bg-slate-600 z-10 relative' value="">--select deck--</option>
                    {userDecks.map((deck, index)=>{
                      return(
                        <option className='z-10 relative' key={deck.deck_name} value={index}>{deck.deck_name}</option>
                      )
                    })}
                  </select>
                </div>
              <br></br>

                {deckWasChosen?
                <div className='z-10 relative'>
                {waiting ?


                  <div className='flex flex-row p-2'>
                    <button onClick={()=>{
                      playHeavyClickSFX()
                      onClickStopSearch()}} className='w-8 h-8 aspect-square bg-red-600 hover:bg-red-900 text-text dark:text-darkText border-slate-600 border-2 font-bold text-xs sm:text-sm md:text-base lg:text-lg rounded-full flex justify-center items-center overflow-hidden text-ellipsis focus:ring-4 focus:ring-red-600'>X</button>
                    <div className='p-2'></div>
                  <h1 className="text-text dark:text-darkText animate-pulse text-2xl z-10 relative">Waiting For Game...</h1>
                  </div>
                  :

                  <div className="w-36 h-36 z-10 rounded-full bg-slate-700 relative">
                    <button className='bg-success dark:bg-darkGreen inset-0 m-auto z-10 h-32 w-32 rounded-full text-text dark:text-darkText absolute shadow-md shadow-white hover:bg-emerald-300 dark:hover:bg-green-600' onClick={()=>{
                      playHeavyClickSFX()
                      onClickPlay()}}>PLAY NOW!</button>
                  </div>
                }

                  <div className='flex flex-row z-10 relative'></div>
                  <br></br>
                </div>
                :
                  <div className="w-36 h-36 rounded-full bg-slate-700 z-10 relative">
                    <button className='cursor-not-allowed bg-gray text-text dark:text-darkText shadow-sm shadow-white inset-0 m-auto h-32 w-32 z-10 rounded-full absolute' >PLAY NOW!</button>
                    <br></br>
                  </div>
                }
       


                
                  {/* INVITES LIST */}
                  <GameTable 
                  playHeavyClickSFX={playHeavyClickSFX}
                  userInvites={userInvites}
                  setUserAcceptedInvs={setUserAcceptedInvs}
                  setUserInvites={setUserInvites}
                  />



        </div>
      </div>
      :
      <div className='z-10 relative'>
        {gameOver ?
          <GameOver gameWinner={gameWinner} volume={volume} user={user}/>
        :
        <div className='h-full z-10 relative'>
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
    enemyHand={enemyHand}
    setEnemyHand={setEnemyHand}
    roundActual={roundActual}
    setRoundActual={setRoundActual}
    volume={volume}
/>
        </div>
        }
      </div>
      }
    </div>
    }
  </div>
)}
