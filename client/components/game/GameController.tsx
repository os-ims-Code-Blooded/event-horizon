import React from 'react';
// import { io } from "socket.io-client";
import { useState, useEffect } from 'react';

import GameBoard from './GameBoard';
import axios from 'axios';

import useSound from 'use-sound';
import whooshpew from '../../sfx/whooshpew.wav'
import shieldcharge from '../../sfx/shieldcharge.wav'
import committurn from '../../sfx/committurn.wav'
import loadclack from '../../sfx/loadclack.wav'
import cardsnap from '../../sfx/cardsnap.wav'
import toggleswitch from '../../sfx/toggleswitch.wav'
import selfdestruct from '../../sfx/selfdestruct.wav'


//creates front-end socket connection to the server
// const socket = io("http://localhost:8080", {
//   withCredentials: true,
//   extraHeaders: {
//     "my-custom-header": "abcd"
//   }
// });


export default function GameController ({ 
  session, 
  socket, 
  setGameOver, 
  setGameWinner, 
  user, 
  userDecks, 
  deckSelected, 
  handSize, 
  roundNum, 
  enemyId, 
  roundInfo, 
  setRoundNum, 
  enemyName, 
  setEnemyName, 
  setEnemyId,
  handProvided,
  enemyHand,
  setEnemyHand,
  roundActual,
  setRoundActual,
  volume
 }){

  //TOP LEVEL GAME COMPONENT

  /////////////STATES//////////////

  //creates react hooks for messages sent and received
  // const [message, setMessage] = useState("")
  // const [messageReceipt, setMessageReceipt] = useState([])

  // console.log("**************", roundInfo[0], "user ID", enemyId)

  let userRound = roundInfo.filter(round=>round.user_id === user.id)

  // console.log("USER ROUND", userRound)

  let enemyRound = roundInfo.filter(round=>round.user_id !== user.id)

  // console.log("ENEMY ROUND", enemyRound)

  //player selected action of BLOCK, LOAD or FIRE
  const [playerAction, setPlayerAction] = useState('')
  const [lastAction, setLastAction] = useState('')
  const [isClicked, setIsClicked] = useState(null);
  

  //player's remaining hit points
  const [hitPoints, setHitPoints] = useState(userRound[0].health || 50)
  const [armor, setArmor] = useState(userRound[0] ? userRound[0].armor : 20)
  //the card the player has just selected
  const [cardToPlay, setCardToPlay] = useState(null)
  const [cardId, setCardId] = useState(null)

 

  //player's remaining hit points
  const [enemyHitPoints, setEnemyHitPoints] = useState(enemyRound[0] ? enemyRound[0].health : 50)
  const [enemyArmor, setEnemyArmor] = useState(enemyRound[0] ? enemyRound[0].armor : 20)
  

  //the enemy's current and last actions
  const [enemyAction, setEnemyAction] = useState('')
  const [enemyWaiting, setEnemyWaiting] = useState(false)
  const [enemyLastAction, setEnemyLastAction] = useState('')

  //did the enemy end their turn?
  const [enemyTurnEnd, setEnemyTurnEnd] = useState(false)

  //is the enemy's weapon armed?
  const [enemyArmed, setEnemyArmed] = useState(false)

  //the enemy's LOADed card
  const [enemyCard, setEnemyCard] = useState([])

  
  //whether or not player's turn has ended
  const [turnEnded, setTurnEnded] = useState(false)

  //tracks which round we're on
  

  //is the plater actively LOADing
  const[activeLoading, setActiveLoading] = useState(false)

  //has the card been LOADed?
  const [weaponArmed, setWeaponArmed] = useState(false)

  const [selfDestruct, setSelfDestruct] = useState(false)
  
  // const [allCards, setAllCards] = useState([])

  const [cardReplacement, setCardReplacement] = useState([])

  const [reloaded, setReloaded] = useState(false)

  const [gameDeck, setGameDeck] = useState(deckSelected)

  const [playerHand, setPlayerHand] = useState(handProvided);
  
  const [expediteState, setExpediteState] = useState(false);

  const [myPrevRound, setMyPrevRound] = useState([])
  const [theirPrevRound, setTheirPrevRound] = useState([])


  // EFFECTS
  const [healthBarShake, setHealthBarShake] = useState(false);
  const [shieldBarShake, setShieldBarShake] = useState(false);

  const [roundSoundsPlayed, setRoundSoundsPlayed] = useState(false)

  const [soundVolume, setSoundVolume] = useState(volume.volume)

  const [cardsRemain, setCardsRemain] = useState(gameDeck.length)

  // console.log("VOLUME!!!!!!!!!!", volume)

  ///////////////// SFX ////////////////////////////////////
  const [playFireSFX] = useSound(whooshpew, volume);
  const [playBlockSFX] = useSound(shieldcharge, volume);
  const [endTurnSFX] = useSound(committurn, volume);
  const [playLoadSFX] = useSound(loadclack, volume);
  const [playCardSFX] = useSound(cardsnap, volume);
  const [playSwitchSFX] = useSound(toggleswitch, volume);
  const [playDestructSFX] = useSound(selfdestruct, volume);
 



  ////////////////////////////////////////////////////////
  const getAllCards = async () => {
    try {
      const response = await axios.get(`/cards/`);
      // console.log("ALL CARD DATA?", response)
      // setAllCards(response.data)
    } catch (error) {
      console.error("Error fetching all cards:", error);
    }
  };

///////////CHOOSING actions/////////////////////////////////////
  const actionClick = (e) =>{

    setRoundSoundsPlayed(true)

    // console.log("click value", e.target.value)

    if (e.target.value === "FIRE"){

      playFireSFX()
    }

    if (e.target.value === "BLOCK"){

      playBlockSFX()
    }
    if (e.target.value === "LOAD"){

      playLoadSFX()
    }
    

    setPlayerAction(e.target.value)
    

    if (e.target.value === 'LOAD' && ( cardToPlay && cardToPlay[1])){
      // console.log("***********CARD TO PLAY:\n", cardToPlay)
      setWeaponArmed(true)
    } else {
      setWeaponArmed(false)
    }

    // console.log("CURRENT action", e.target.value, "LAST action", lastAction)
    if (e.target.value === "LOAD" && lastAction === "LOAD" && cardReplacement.length > 0){
      setReloaded(true)
      // console.log("RELOADED?")
    }
  }

 //////////// FORFEIT GAME /////////////////

  const forfeit = async () =>{
    // console.log("ENEMY ID", enemyId)
    try{

      if (selfDestruct){
        playDestructSFX()

        let gameOver = await axios.patch(`/games/${session}`, {

          "data":{
            "user_id": user.id
        }
      }
    )
    setGameOver(true)
    // console.log("GAME OVER EMISSION", gameOver)
    socket.emit('game_over', gameOver, session)
  }
   
    }
    catch(err){
      console.error(err)
    }


  }

//////////// END TURN ////////////////////////////////
  const endTurn = async () =>{
    setRoundSoundsPlayed(true)
    endTurnSFX()

    //send patch request to server with stringified hand and 
    // setRoundActual(roundActual + 1)
    
    setLastAction(playerAction)
   
    // console.log("*** CARD ID ***\n", cardId)

      socket.emit('end_turn', {
        "body":{
          "data": {
            "round_id": roundNum,
            "user_id": user.id,
            "action": playerAction,
            "card_id": cardId,
            "expedite": expediteState
        }
      }, session})



  }


  ////////////////LIFECYCLE/////////////////
  //when the client socket receives a new message, the received message state is updated

  useEffect(()=>{

    //  console.log("--------->>> VOLUME <<<---------", volume)
    
    if (playerHand.length === 0){
      setExpediteState(true);
    }

    // console.log("SESSION #####", session)

    if (enemyRound[0]){
      setEnemyName(enemyRound[0].name)
      // console.log("********** ENEMY ROUND", enemyRound[0])
    }

    socket.on('game_over', (data: any)=>{
      console.log("********************GAME OVER DATA", data)
      setGameOver(true)
      setGameWinner(data.data.GameComplete.victor_id)
    })

    socket.on('received_rounds_data', (data: any) => {

      setRoundSoundsPlayed(true)

      // console.log("*** ROUND RESPONSE DATA ***\n", data)


      if (data.Current) {

        // Current player information
        let playerCurrRound = data.Current.game_player_information.filter((round: { user_id: any; })=>round.user_id === user.id)
        let enemyCurrRound = data.Current.game_player_information.filter((round: { user_id: any; })=>round.user_id !== user.id)

        // Previous player information
        let playerPrevRound = data.Previous.game_player_information.filter((round: { user_id: any; })=>round.user_id === user.id)
        let enemyPrevRound = data.Previous.game_player_information.filter((round: { user_id: any; })=>round.user_id !== user.id)

        // if the player has lost health this round, then display an effect
        if (playerCurrRound[0].health < playerPrevRound[0].health) {
          setHealthBarShake(true);
          setTimeout(() => {
            setHealthBarShake(false);
          }, 1000)
        }
         // if the enemy player has lost health this round, then display an effect
         if (enemyCurrRound[0].health < enemyPrevRound[0].health) {
          setHealthBarShake(true);
          setTimeout(() => {
            setHealthBarShake(false);
          }, 1000)
        }

        // if the player's armor is now less than it was, but it is not broken
        if (playerCurrRound[0].armor < playerPrevRound[0].armor) {
          setShieldBarShake(true);
          setTimeout(() => {
            setShieldBarShake(false);
          }, 1000)
        }

         // if the enemy's armor is now less than it was, but it is not broken
         if (enemyCurrRound[0].armor < enemyPrevRound[0].armor) {
          setShieldBarShake(true);
          setTimeout(() => {
            setShieldBarShake(false);
          }, 1000)
        }

      }


      if (data.user_id){
        if (data.user_id !== user.id){
          setEnemyWaiting(true)
        }
      }

      if (data.Current){
        setRoundNum(data.Current.id)
        setRoundActual(data.Current.actual)



      let myHand = data.Current.game_card_states.filter(cardState=>cardState.user_id === user.id).map(enemyCardState=>enemyCardState.hand).flat();


      let theirHand = data.Current.game_card_states.filter(cardState=>cardState.user_id === enemyId).map(enemyCardState=>enemyCardState.hand).flat();

      // console.log("ENEMY'S HAND CARDS:", theirHand)
      setEnemyHand(theirHand)
      setPlayerHand(myHand)

      if (myHand.length === 0) {
        setExpediteState(true);
      }

      if (data.Current){


        // console.log("*************\n", data.Current.game_card_states.filter((deckState)=>deckState.user_id === user.id)[0])
        setCardsRemain(data.Current.game_card_states.filter((deckState)=>deckState.user_id === user.id)[0].deck.length)
        setRoundSoundsPlayed(false)


        let playerCurrRound = data.Current.game_player_information.filter((round: { user_id: any; })=>round.user_id === user.id)
        let enemyCurrRound = data.Current.game_player_information.filter((round: { user_id: any; })=>round.user_id !== user.id)
        let playerPrevRound = data.Previous.actions.filter((action: { user_id: any; })=>action.user_id === user.id)
        let enemyPrevRound = data.Previous.actions.filter((action: { user_id: any; })=>action.user_id !== user.id)

        


        setEnemyLastAction(enemyPrevRound[0].action)
        setMyPrevRound(playerPrevRound);
        setTheirPrevRound(enemyPrevRound);


        // if (enemyPrevRound.length > playerPrevRound.length){
      //   setEnemyWaiting(true)
      // }


      if (enemyPrevRound[enemyPrevRound.length - 1].damage){
        // console.log("HELOOOOOOOO")
        setEnemyArmed(true)
      }



      if (enemyPrevRound[0].action === 'FIRE'){
        // console.log("FIRED!!!")
        setEnemyArmed(false)
        // if (enemyPrevRound[0]){
        //   // console.log("ENEMY'S PREVIOUS ROUND INFO", enemyPrevRound[0])

        //   // getAllCards();
        //   // // console.log("ALL CARDS?", allCards)



        // }
      }


      // if (enemyPrevRound[0].action === 'FIRE'){
      //     // console.log("FIRED!!!")
      //     setEnemyArmed(false)
      //   }

        //checks if both players have committed a turn for this round

        if (playerPrevRound.length === enemyPrevRound.length) {
          setArmor(playerCurrRound[0].armor)
          setHitPoints(playerCurrRound[0].health)
          setEnemyArmor(enemyCurrRound[0].armor)
          setEnemyHitPoints(enemyCurrRound[0].health)
          setEnemyLastAction(enemyPrevRound[enemyPrevRound.length - 1].action)
          setActiveLoading(false)
          setEnemyAction('')
          setEnemyTurnEnd(false)
          setTurnEnded(false)
          setPlayerAction('')
          setEnemyWaiting(false)
          
          // we need to set card deck and hand here, but I don't know how to make it work within what we already have
          // this should become apparent when this round info is console.log()
        }
        
        //expend ordinance if fired
        // if (playerAction === 'FIRE'){
          //   setCardToPlay(null)
          // }

          //reset the actions



          
      setPlayerAction('')
      setEnemyWaiting(false)
      
    }
  }

    // console.log("data", data)

      ////// VICTORY CONDITIONS /////////////
      if (data.GameComplete){

        setGameOver(true)
        setGameWinner(data.GameComplete.victor_id);



        ////// VICTORY CONDITIONS /////////////
        if (data.GameComplete){
          setGameOver(true)
          setGameWinner(data.GameComplete.victor_id);
        }

      }

    })

    ////////////for messaging/////////////////////
    // socket.on("receive_message", (data)=>{   //
    //   console.log("DATA MESSAGE:", data)     //
    //   setMessageReceipt(data)                //
    // })                                       //
    //////////////////////////////////////////////
  }, [socket])




/////////////RENDER////////////////////////
  //renders an input a button, and a spot for messages
  return (
    <div className='flex flex-shrink h-full w-full'>
        <GameBoard
          session={session}
          socket={socket}
          roundActual={roundActual}
          user={user}
          userDecks={userDecks}
          deckSelected={deckSelected}
          gameDeck={gameDeck}
          setGameDeck={setGameDeck}
          playerHand={playerHand}
          setPlayerHand={setPlayerHand}
          setIsClicked={setIsClicked}
          isClicked={isClicked}

          handSize={handSize}
          cardReplacement={cardReplacement}
          setCardReplacement={setCardReplacement}
          reloaded={reloaded}
          setReloaded={setReloaded}

          endTurn={endTurn}
          setPlayerAction={setPlayerAction}
          playerAction={playerAction}
          cardToPlay={cardToPlay}
          setCardToPlay={setCardToPlay}
          setCardId={setCardId}
          cardsRemain={cardsRemain}
          setCardsRemain={setCardsRemain}

          enemyName={enemyName}
          enemyAction={enemyAction}
          enemyWaiting={enemyWaiting}
          enemyLastAction={enemyLastAction}
          enemyHitPoints={enemyHitPoints}
          enemyArmor={enemyArmor}
          enemyCard={enemyCard}
          enemyTurnEnd={enemyTurnEnd}
          enemyArmed={enemyArmed}
          enemyHand={enemyHand}

          weaponArmed={weaponArmed}
          setWeaponArmed={setWeaponArmed}
          hitPoints={hitPoints}
          setHitPoints={setHitPoints}
          armor={armor}

         
          turnEnded={turnEnded}
          setTurnEnded={setTurnEnded}
          activeLoading={activeLoading}
          setActiveLoading={setActiveLoading}
          actionClick={actionClick}
          discard={undefined}
          setSelfDestruct={setSelfDestruct} 
          selfDestruct={selfDestruct}
          forfeit={forfeit}
          userRound={userRound}
          enemyRound={enemyRound}
          myPrevRound={myPrevRound}
          theirPrevRound={theirPrevRound}
          healthBarShake={healthBarShake}
          shieldBarShake={shieldBarShake}

          playCardSFX={playCardSFX}
          playSwitchSFX={playSwitchSFX}
          setRoundSoundsPlayed={setRoundSoundsPlayed}
          roundSoundsPlayed={roundSoundsPlayed}
          soundVolume={soundVolume}
          volume={volume}
          />
    </div>
  )
}