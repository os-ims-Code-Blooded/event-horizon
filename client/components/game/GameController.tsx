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


export default function GameController ({ session, socket, setGameOver, setGameWinner, user, userDecks, deckSelected, handSize, roundNum }){

  //TOP LEVEL GAME COMPONENT

  /////////////STATES//////////////

  //creates react hooks for messages sent and received
  // const [message, setMessage] = useState("")
  // const [messageReceipt, setMessageReceipt] = useState([])

 
  //player selected action of BLOCK, LOAD or FIRE
  const [playerAction, setPlayerAction] = useState('')
  //player's remaining hit points
  const [hitPoints, setHitPoints] = useState(50)
  const [armor, setArmor] = useState(20)
  //the card the player has just selected
  const [cardToPlay, setCardToPlay] = useState(null)
  const [cardId, setCardId] = useState(null)

  const [enemyName, setEnemyName] = useState('')

  //player's remaining hit points
  const [enemyHitPoints, setEnemyHitPoints] = useState(50)
  const [enemyArmor, setEnemyArmor] = useState(20)
  

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


  //for a finished game
  // const [gameOver, setGameOver] = useState(false)
  // const [gameWinner, setGameWinner] = useState('')


///////////CHOOSING ACTIONS/////////////////////////////////////
  const actionClick = (e) =>{
    // console.log("click value", e.target.value)

    setPlayerAction(e.target.value)

    if (e.target.value === 'LOAD' && cardToPlay){
      setWeaponArmed(true)
    } else {
      setWeaponArmed(false)
    }
  }

 ////////////END TURN/////////////////


  const endTurn = async () =>{
    setRoundDisplay(roundDisplay + 1)


    socket.emit('end_turn', {
      "body":{
        "data": {
          "round_id": roundNum,
          "user_id": user.id,
          "action": playerAction,
          "card_id": cardId
      }

    }, session})


 //emits turn for BLOCK
//  if (playerAction === "BLOCK"){
//   socket.emit('BLOCK_end_turn', {playerAction, turnEnded: true, session})
// }

// //emits turn for FIRE
// if (playerAction === "FIRE"){
//   socket.emit('FIRE_end_turn', {playerAction, cardToPlay, session})
// }

// //emits turn for LOAD
// if (playerAction === "LOAD"){
//   socket.emit('LOAD_end_turn', {playerAction, cardToPlay, turnEnded: true, session})
// }

// if (playerAction === ""){
//   socket.emit('lame_end_turn', playerAction, session)
// }


    /////////// REQUEST HANDLING /////////////////////////

    // await axios.post('/games/rounds', {
    //     'data': {
    //     'round_id': 1,
    //     'user_id': 1,
    //     'action': 'LOAD',
    //     'card_id': 1
    //   }
    // })
    // .then(response=>console.log(response))
    // .catch(err => console.error("failed to post move data", err))


  }


  ////////////////LIFECYCLE/////////////////
  //when the client socket receives a new message, the received message state is updated

  useEffect(()=>{

 
    //join session, sends the user object
    if (session){
      socket.emit("join_session", session, user)
    }


    socket.on('received_rounds_data', (data: any)=>{


      console.log("RESPONSE DATA FROM SOCKET", data)

      



        // console.log("CURRENT ROUND INFO", data.Current.Round_Player_Info)





        let playerCurrRound = data.Current.Round_Player_Info.filter((round: { user_id: any; })=>round.user_id === user.id)

        let enemyCurrRound = data.Current.Round_Player_Info.filter((round: { user_id: any; })=>round.user_id !== user.id)

        let playerPrevRound = data.Previous.Actions.filter((action: { user_id: any; })=>action.user_id === user.id)

        let enemyPrevRound = data.Previous.Actions.filter((action: { user_id: any; })=>action.user_id !== user.id)



        
        console.log("CURRENT PLAYER'S ROUND INFO", playerCurrRound)
        
        console.log("CURRENT ENEMY'S ROUND INFO", enemyCurrRound)
  
        console.log("prev PLAYER'S ROUND INFO", playerPrevRound)
        
        console.log("prev ENEMY'S ROUND INFO", enemyPrevRound)


      if (enemyPrevRound.length > playerPrevRound.length){
        setEnemyWaiting(true)
      }





        //checks if both players have committed a turn for this round
        if (playerPrevRound.length === enemyPrevRound.length){



        setArmor(playerCurrRound[0].armor)
        setHitPoints(playerCurrRound[0].health)

        setEnemyArmor(enemyCurrRound[0].armor)
        setEnemyHitPoints(enemyCurrRound[0].health)
        setEnemyLastAction(enemyPrevRound[enemyPrevRound.length - 1].action)

          console.log("enemyLastAction damage?", enemyPrevRound[enemyPrevRound.length - 1].damage)

        
        setActiveLoading(false)




        if (enemyPrevRound[enemyPrevRound.length - 1].damage){
          console.log("HELOOOOOOOO")
          setEnemyArmed(true)
        }




        if (enemyLastAction === 'FIRE'){
          setEnemyArmed(false)
        }




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
      if (data.GameComplete.victor_id){
        setGameOver(true)
        setGameWinner(data.GameComplete.victor_id);
        

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
          handSize={handSize}

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
          armor={armor}

          roundDisplay={roundDisplay}
          turnEnded={turnEnded}
          setTurnEnded={setTurnEnded}
          activeLoading={activeLoading}
          setActiveLoading={setActiveLoading}
          actionClick={actionClick}
          discard={undefined}        />
    </div>
  )
}