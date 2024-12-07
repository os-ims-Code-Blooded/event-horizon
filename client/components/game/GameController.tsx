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
  handProvided
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

  const getAllCards = async () => {
    try {
      const response = await axios.get(`/cards/`);
      console.log("ALL CARD DATA?", response)
      setAllCards(response.data)
    } catch (error) {
      console.error("Error fetching all cards:", error);
    }
  };
  
  const [gameDeck, setGameDeck] = useState(deckSelected);

  const [playerHand, setPlayerHand] = useState(handProvided);

 

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
    console.log("ENEMY ID", enemyId)
    try{

      if (selfDestruct){

        let gameOver = await axios.patch(`/games/${session}`, {

          "data":{
            "user_id": user.id
        }
      }
    )
    // setGameOver(true)
        // console.log("GAME OVER EMISSION", gameOver)
        socket.emit('game_over', gameOver.data, session)
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
          "deck_state": gameDeck,
          "hand_state": playerHand
      }
    }, session})
  }


  ////////////////LIFECYCLE/////////////////
  //when the client socket receives a new message, the received message state is updated

  useEffect(()=>{

    // console.log("SESSION #####", session)

    if (enemyRound[0]){
      setEnemyName(enemyRound[0].name)
    }

    socket.on('game_over', (data: any)=>{
      // console.log("********************GAME OVER DATA", data)
      console.log("WINNER?", data)
      setGameWinner(data.GameComplete.victor_id)
      setGameOver(true)


    })


    socket.on('received_rounds_data', (data: any)=>{


      console.log("*** ROUND RESPONSE DATA ***\n", data)

      const emission = {
        user_id: user.id,
        round_id: data.Current.id,
        socket_id: socket
      }

    }, 0)

    
    if (userHasCard) {
      console.log(`Attempting to return card ID #${userHasCard} to #${user.id} hand.`)
      console.log(`Selected deck is currently: `, deckSelected)

      const cardToReturnToHand = deckSelected.filter((card) => {
        return (card.card_id === userHasCard)
      })
      console.log(`Found card to return to hand: `, cardToReturnToHand)
    }
  }

//////////////////////////////////////////


  if (data.user_id){
    if (data.user_id !== user.id){
      setEnemyWaiting(true)
    }
  }


  if (data.Current){
    setRoundNum(data.Current.id)
  }



  if(data.UnloadedCards){
    setCardReplacement(data.UnloadedCards)
  }
        // console.log("CURRENT ROUND INFO", data.Current.Round_Player_Info)

  if (data.Current){

    let playerCurrRound = data.Current.Round_Player_Info.filter((round: { user_id: any; })=>round.user_id === user.id)
    
    let enemyCurrRound = data.Current.Round_Player_Info.filter((round: { user_id: any; })=>round.user_id !== user.id)

    let playerPrevRound = data.Previous.Actions.filter((action: { user_id: any; })=>action.user_id === user.id)

    let enemyPrevRound = data.Previous.Actions.filter((action: { user_id: any; })=>action.user_id !== user.id)

      socket.emit('deck_state_request', (emission))

      if (data.user_id){
        if (data.user_id !== user.id){
          setEnemyWaiting(true)
        }
      }

      if (data.Current){
        setRoundNum(data.Current.id)
      }

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
        console.log("ENEMY'S PREVIOUS ROUND INFO", enemyPrevRound[0])

        getAllCards();
        console.log("ALL CARDS?", allCards)

        // const getAllCards = async () => {
        //   try {
        //     const response = await axios.get(`/cards/`);

        //     console.log("ALL CARD DATA?", response.data)
        //   } catch (error) {
        //     console.error("Error fetching all cards:", error);
        //   }
        // };
        // console.log("ALL CARD DATA? --->", getAllCards)

      }
    }


      ///////////////////////////////////////////////
        //checks if both players have committed a turn for this round
        if (playerPrevRound.length === enemyPrevRound.length){



        setArmor(playerCurrRound[0].armor)
        setHitPoints(playerCurrRound[0].health)

        setEnemyArmor(enemyCurrRound[0].armor)
        setEnemyHitPoints(enemyCurrRound[0].health)
        setEnemyLastAction(enemyPrevRound[enemyPrevRound.length - 1].action)

          // console.log("enemyLastAction damage?", enemyPrevRound[enemyPrevRound.length - 1].damage)

        
        setActiveLoading(false)








        setEnemyAction('')
        setEnemyTurnEnd(false)
        setTurnEnded(false)


        //expend ordinance if fired
        // if (playerAction === 'FIRE'){
          //   setCardToPlay(null)
          // }

          //reset the actions



      
      setPlayerAction('')
      setEnemyWaiting(false)

    }

    
    ////// VICTORY CONDITIONS /////////////
    if (data.GameComplete){
      
        console.log("victory data?", data)

        setGameWinner(data.GameComplete.victor_id);

        setGameOver(true)


      }

      }

    })

    socket.on('deck_state_response', (data) => {
      setGameDeck(JSON.parse(data['Current Deck']));
      setPlayerHand(JSON.parse(data['Current Hand']));
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