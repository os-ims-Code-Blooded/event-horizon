import React from 'react';
import { useState } from 'react';
import axios from 'axios'
import { useEffect } from 'react';


////////////////////////////
import GameController from './GameController';
import GameOver from './GameOver.tsx';
import GamesTable from './GamesTable.tsx';
import SelectDeck from '../cards/SelectDeckModal.tsx';
////////////////////////////

export default function SelectGame({
  user,
  volume,
  playMusic,
  click13,
  click6,
  playHeavyClickSFX,
  musicPlayed,
  setMusicPlayed,
  socketRef,

  userInvites,
  setUserAcceptedInvs,
  setUserInvites,
  userAcceptedInvs,
  acceptedOutgoingInvs,
  decl
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

  const [session, setSession] = useState("")

  const [roundNum, setRoundNum] = useState(1)

  const [roundActual, setRoundActual] = useState(1)

  const [enemyId, setEnemyId] = useState(null)

  const [enemyName, setEnemyName] = useState('')

  const [roundInfo, setRoundInfo] = useState([])

  const [activeUserGame, setActiveUserGame] = useState(false)

  const [waiting, setWaiting] = useState(false)

//////////////////////////////////////////////////////////////

  const opponentCards = [
    {
    },
    {
    },
    {
    },
  ];

  const [enemyHand, setEnemyHand] = useState(opponentCards)


///////////////////////////////////////////////////////////////

  const [showPublicModal, setShowPublicModal] = useState(false); // this enables the SelectGame page to show the modal when the Play Now button is clicked

  const [showPrivateModal, setShowPrivateModal] = useState(false); // this enables the SelectGame page to show a modal when we click "Accept" for a pending game

  const [privateGameID, setPrivateGameID] = useState<null | number>(null); // this will be a state that we can change for a callback param for joining a private game

////////////////////////////////////////////////////////////////

  const [openGames, setOpenGames] = useState(userAcceptedInvs.concat(
    acceptedOutgoingInvs))


  if (!musicPlayed){
    playMusic();
    setMusicPlayed(true)
  }


  useEffect( () => {

    axios
    .get(`/games/${user.id}`)
    .then((response) => {
      setActiveUserGame(true); // this state will be used to determine if we need to render a modal
    })
    .catch((error) => {
      console.error(`No public games found for user.`);
    });   

  }, [])


  const startSearchPublicGame = () => {
    if (activeUserGame) {
      onClickPlay();
    } else {
      setShowPublicModal(true); // this will open modal for user to select a deck, then it will conduct an onClickPlay
    }
  };


  const startSearchPrivateGame = (privateGameID) => {
    if (privateGameID.accepted) {
      joinPrivateGame(privateGameID);
    } else {
      setShowPrivateModal(true); // this will open modal for user to select a deck, then it will conduct a joinPrivateSession
    }
  };


  const joinPrivateGame = async (openGame) =>{

    try {

      const game = await axios.post(`/games/private/join/${openGame}`, { "user_id": user.id });

      setSession(openGame);               // we derive the game ID from the invite
      setRoundNum(game.data["Current Round"]);    // all of this data is made available from Axios request
      setDeckSelected(game.data["Current Deck"]);
      setHandProvided(game.data["Current Hand"]);
      setRoundActual(game.data["Current Round Actual"]);

      // we changed the game_id emission here because it was referencing something that didn't exist
      socketRef.current.emit("join_session", String(openGame), user, game.data["Current Round"]);

      // I don't know if putting an event listener here is an issue
      // this might need to be somewhere else?
      socketRef.current.on('session_players', (data: any) => {

        // when we receive emission, see if there is an enemy
        const enemy = data.filter((player) => {
          return (player.user_id !== user.id)
        })

        // if the filtered array contains an enemy
        if (enemy.length > 0) {
          setEnemyName(enemy[0].name);  // set that enemy's name
          setEnemyId(enemy[0].user_id); // set that enemy's user ID
          setRoundInfo(data)            // set the current round information
          setActiveUserGame(true)          // then trigger Game Board conditional render
          setPlayClicked(true)
        }
      })

    } catch (error) {
      console.error(`Error on connecting to a game session.`)
    }










  }


  const declineInv = async(gameId: number) => {
    try{
      await axios.delete(`/games/private/invites/${gameId}`);
      const retrievedInvites = await axios.get(`/games/private/invites`);
      decl();
      setUserInvites(retrievedInvites.data.Incoming.Pending);
      setUserAcceptedInvs(retrievedInvites.data.Incoming.Accepted);
    } catch(error) {
      console.error('Failed to decline Game Invite');
    }
  }


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

      socketRef.current.emit("join_session", String(game.data.id), user, round.data["Current Round"]);

      // I don't know if putting an event listener here is an issue
      // this might need to be somewhere else?
      socketRef.current.on('session_players', (data: any) => {

        // when we receive emission, see if there is an enemy
        const enemy = data.filter((player) => {

          return (player.user_id !== user.id)
        })

        if (deckSelected){

        }

        // if the filtered array contains an enemy
        if (enemy.length > 0) {
          setEnemyName(enemy[0].name);  // set that enemy's name
          setEnemyId(enemy[0].user_id); // set that enemy's user ID
          setRoundInfo(data)            // set the current round information
          setActiveUserGame(true)          // then trigger Game Board conditional render
          setPlayClicked(true)
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

return(

  <div id="selectGame" className='max-h-screen min-h-screen min-w-screen max-w-screen'>
  <div className=' bg-starfield-light dark:bg-starfield inset-0 z-9 absolute w-screen h-screen'></div>










{!playClicked?


  <div className='pt-20 flex flex-col h-full items-center justify-center min-h-screen z-10 relative'>


    <div id="Public-modal">
    {showPublicModal ? (
      <div className="modal fixed inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 z-40 modal-middle">
        <SelectDeck
          user={user}
          volume={volume}
          toggleModal={setShowPublicModal}
          callback={onClickPlay}
          callbackParams={null}
        />
      </div>
    ) : (
      null
    )}
  </div>



  <div id="Private-modal">
  {showPrivateModal ? (
    <div className="modal fixed inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 z-40 modal-middle">
      <SelectDeck
        user={user}
        volume={volume}
        toggleModal={setShowPrivateModal} // this tells the SelectDeckModal to change this state when everything is complete, so the SelectGame will stop rendering modal
        callback={joinPrivateGame} // as well as here, this is the callback that will be executed when modal is completed (not cancelled)
        callbackParams={privateGameID} // and here, this will give the privateGameID to joinPrivateGame (executed when modal is closed with Accept button)
      />
    </div>
    ) : (
      null
    )}
  </div>



    {/* WAITING FOR GAME */}

    {waiting ?
    <div className='flex flex-row p-2'>
      <button onClick={()=>{
        playHeavyClickSFX()
        onClickStopSearch()}} className='w-8 h-8 aspect-square bg-red-600 hover:bg-red-900 text-text dark:text-darkText border-slate-600 border-2 font-bold text-xs sm:text-sm md:text-base lg:text-lg rounded-full flex justify-center items-center overflow-hidden text-ellipsis focus:ring-4 focus:ring-red-600'>X</button>
      <div className='p-2'></div>
    <h1 className="text-text dark:text-darkText animate-pulse text-2xl z-10 relative">Waiting For Game...</h1>
    </div>

    :
          <div>
        {activeUserGame? 
          
          <div className="w-36 h-36 z-10 rounded-full bg-slate-700 relative">
            <button className='bg-success dark:bg-darkGreen inset-0 m-auto z-10 h-32 w-32 rounded-full text-text dark:text-darkText absolute shadow-md shadow-white hover:bg-emerald-300 dark:hover:bg-green-600' onClick={()=>{
              playHeavyClickSFX()
              onClickPlay()}}>REJOIN!</button>
          </div>
          
          :

          <div className="w-36 h-36 z-10 rounded-full bg-slate-700 relative">
            <button className='bg-success dark:bg-darkGreen inset-0 m-auto z-10 h-32 w-32 rounded-full text-text dark:text-darkText absolute shadow-md shadow-white hover:bg-emerald-300 dark:hover:bg-green-600' onClick={()=>{
              playHeavyClickSFX()
              setShowPublicModal(true)}}>PLAY NOW!</button>
          </div>

        }

        </div>
    }

{/* ALL SENT/RECEIVED INVITES */}

<div className='p-4'></div>
    {openGames.length > 0 || userInvites.length > 0?  
    <GamesTable
      playHeavyClickSFX={playHeavyClickSFX}
      userInvites={userInvites}
      userAcceptedInvs={userAcceptedInvs}
      setUserAcceptedInvs={setUserAcceptedInvs}
      setUserInvites={setUserInvites}
      socketRef={socketRef}
      acceptedOutgoingInvs={acceptedOutgoingInvs}

      setSession={setSession}
      setRoundNum={setRoundNum}
      setDeckSelected={setDeckSelected}
      setHandProvided={setHandProvided}
      setRoundActual={setRoundActual}
      user={user}

      setEnemyName={setEnemyName}
      setEnemyId={setEnemyId}
      setActiveUserGame={setActiveUserGame}
      setRoundInfo={setRoundInfo}
      deckSelected={deckSelected}
      decl={decl}
      declineInv={declineInv}
      setShowPrivateModal={setShowPrivateModal}
      setPrivateGameID={setPrivateGameID}
      openGames={openGames}
      setPlayClicked={setPlayClicked}
      joinPrivateGame={joinPrivateGame}
      />

    :
      null
    }



  </div>

:
<div>
{gameOver?
  <>
    <GameOver volume={volume} gameWinner={gameWinner} user={user} session={session}/>
  </>
    :
    <div className='h-full z-12 relative'>
      <GameController
       session={session}
       socketRef={socketRef}
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



)}
