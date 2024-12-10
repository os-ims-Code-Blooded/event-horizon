import React from 'react';
// import { io } from "socket.io-client";
import { useState, useEffect } from 'react';

import GameBoard from './GameBoard';
import axios from 'axios';


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
  setEnemyHand
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


  //player's remaining hit points
  const [hitPoints, setHitPoints] = useState(userRound[0].health || 50)
  const [armor, setArmor] = useState(userRound[0].armor || 20)
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
  const [enemyCard, setEnemyCard] = useState('')

  
  //whether or not player's turn has ended
  const [turnEnded, setTurnEnded] = useState(false)

  //tracks which round we're on
  

  //is the plater actively LOADing
  const[activeLoading, setActiveLoading] = useState(false)

  //has the card been LOADed?
  const [weaponArmed, setWeaponArmed] = useState(false)

  const [roundDisplay, setRoundDisplay] = useState(1)

  const [selfDestruct, setSelfDestruct] = useState(false)
  
  const [allCards, setAllCards] = useState([])

  const [cardReplacement, setCardReplacement] = useState([])

  const [reloaded, setReloaded] = useState(false)

  const [gameDeck, setGameDeck] = useState(deckSelected)

  const [playerHand, setPlayerHand] = useState(handProvided)
  
  
  

  
  const getAllCards = async () => {
    try {
      const response = await axios.get(`/cards/`);
      // console.log("ALL CARD DATA?", response)
      setAllCards(response.data)
    } catch (error) {
      console.error("Error fetching all cards:", error);
    }
  };

///////////CHOOSING ACTIONS/////////////////////////////////////
  const actionClick = (e) =>{
    // console.log("click value", e.target.value)
    

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

    //send patch request to server with stringified hand and 

    
    setLastAction(playerAction)
    setRoundDisplay(roundDisplay + 1)
    // console.log("*** CARD ID ***\n", cardId)

    socket.emit('end_turn', {
      "body":{
        "data": {
          "round_id": roundNum,
          "user_id": user.id,
          "action": playerAction,
          "card_id": cardId,
      }
    }, session})
  }


  ////////////////LIFECYCLE/////////////////
  //when the client socket receives a new message, the received message state is updated

  useEffect(()=>{

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

      console.log("*** ROUND RESPONSE DATA ***\n", data)


      // if (data.Current) {

      //   // Current player information
      //   let playerCurrRound = data.Current.Round_Player_Info.filter((round: { user_id: any; })=>round.user_id === user.id)
      //   let enemyCurrRound = data.Current.Round_Player_Info.filter((round: { user_id: any; })=>round.user_id !== user.id)

      //   // Previous player information
      //   let playerPrevRound = data.Previous.Round_Player_Info.filter((round: { user_id: any; })=>round.user_id === user.id)
      //   let enemyPrevRound = data.Previous.Round_Player_Info.filter((round: { user_id: any; })=>round.user_id !== user.id)

      //   // if the player has lost health this round, then display an effect
      //   // if (playerCurrRound[0].health < playerPrevRound[0].health) {
      //   //   // setToggleHealthDangerEffect(true);
      //   //   setTimeout(() => {
      //   //     // setToggleHealthDangerEffect(false);
      //   //   }, 1000)
      //   // }

      //   // if the player's armor was just broken, then display an effect
      //   // if (playerCurrRound[0].armor === 0 && playerPrevRound[0].armor > 0) {
      //   //   // setToggleShatteredArmorEffect(true);
      //   //   setTimeout(() => {
      //   //     // setToggleShatteredArmorEffect(true);
      //   //   }, 1000)
      //   // }
        
      //   // // if the player's armor is now less than it was, but it is not broken
      //   // if (playerCurrRound[0].armor < playerPrevRound[0].armor) {
      //   //   // setToggleArmorDamagedEffect(true);
      //   //   setTimeout(() => {
      //   //     // setToggleArmorDamagedEffect(true);
      //   //   }, 1000)
      //   // }

      //   // enableVFX(playerPrevRound, playerCurrRound)
      //   // enableVFX(enemyPrevRound, enemyCurrRound)

      // }


      if (data.user_id){
        if (data.user_id !== user.id){
          setEnemyWaiting(true)
        }
      }

      if (data.Current){
        setRoundNum(data.Current.id)



      let myHand = data.Current.Game_Card_States.filter(cardState=>cardState.user_id === user.id).map(enemyCardState=>enemyCardState.hand).flat();


      let theirHand = data.Current.Game_Card_States.filter(cardState=>cardState.user_id === enemyId).map(enemyCardState=>enemyCardState.hand).flat();

      console.log("ENEMY'S HAND CARDS:", theirHand)
      setEnemyHand(theirHand)
      setPlayerHand(myHand)

      if (data.Current){
        let playerCurrRound = data.Current.Round_Player_Info.filter((round: { user_id: any; })=>round.user_id === user.id)
        let enemyCurrRound = data.Current.Round_Player_Info.filter((round: { user_id: any; })=>round.user_id !== user.id)
        let playerPrevRound = data.Previous.Actions.filter((action: { user_id: any; })=>action.user_id === user.id)
        let enemyPrevRound = data.Previous.Actions.filter((action: { user_id: any; })=>action.user_id !== user.id)

        
        setEnemyLastAction(enemyPrevRound[0].action)
        
        
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
        if (enemyPrevRound[0]){
          // console.log("ENEMY'S PREVIOUS ROUND INFO", enemyPrevRound[0])
          
          getAllCards();
          // console.log("ALL CARDS?", allCards)
          
          
          
        }
      }
      
      
      if (enemyPrevRound[0].action === 'FIRE'){
          // console.log("FIRED!!!")
          setEnemyArmed(false)
        }

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
    <div className='h-full w-full'>
        <GameBoard
          session={session}
          socket={socket}
          user={user}
          userDecks={userDecks}
          deckSelected={deckSelected}
          gameDeck={gameDeck}
          setGameDeck={setGameDeck}
          playerHand={playerHand}
          setPlayerHand={setPlayerHand}


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

          roundDisplay={roundDisplay}
          turnEnded={turnEnded}
          setTurnEnded={setTurnEnded}
          activeLoading={activeLoading}
          setActiveLoading={setActiveLoading}
          actionClick={actionClick}
          discard={undefined}
          setSelfDestruct={setSelfDestruct} 
          selfDestruct={selfDestruct}
          forfeit={forfeit}
          />
    </div>
  )
}