import React, { FC, act, useState } from 'react';
import Card from './Card';
import ActionSelect from './ActionSelect';
import sampleDeckData from './sampleDeckData';
// import Gameplay from './Gameplay';


interface CardType {
  name: string;
  damage: number;
  armor: number;
  description: string;
  id: number;
}
type GameBoardProp = {
  session: string;
  socket: any
  user: any
  userDecks: any
  deckSelected: any
  cardReplacement: any
  setCardReplacement: any
  reloaded: any
  setReloaded: any

  endTurn: any
  playerAction: any
  setPlayerAction: any
  handSize: any
  gameDeck: any
  setGameDeck: any
  playerHand: any
  setPlayerHand: any

  enemyName: any
  enemyAction: any
  enemyWaiting: any
  enemyLastAction: any
  enemyHitPoints: number
  enemyArmor: number
  enemyCard: any
  enemyTurnEnd: any
  enemyArmed: any
  enemyHand: any

  cardToPlay: any
  setCardToPlay: any
  setCardId: any
  weaponArmed: any
  setWeaponArmed: any
  hitPoints: number
  setHitPoints: any
  armor: number

  roundDisplay: number
  turnEnded: any
  setTurnEnded: any
  activeLoading: any
  setActiveLoading: any
  actionClick: any

  discard: any
  setSelfDestruct: any
  selfDestruct: any
  forfeit: any

}

const GameBoard: FC <GameBoardProp> = ({
  session,
  socket,
  user,
  userDecks,
  deckSelected,
  handSize,
  gameDeck,
  setGameDeck,
  playerHand,
  setPlayerHand,


  playerAction,
  setPlayerAction,
  cardToPlay,
  setCardToPlay,
  setCardId,
  cardReplacement,
  setCardReplacement,
  reloaded,
  setReloaded,

  endTurn,
  turnEnded,
  hitPoints,
  setHitPoints,
  armor,

  enemyName,
  enemyAction,
  enemyWaiting,
  enemyLastAction,
  enemyHitPoints,
  enemyArmor,
  enemyCard,
  enemyTurnEnd,
  enemyArmed,
  enemyHand,

  weaponArmed,
  setWeaponArmed,
  roundDisplay,
  setTurnEnded,
  activeLoading,
  setActiveLoading,
  actionClick,
  setSelfDestruct,
  selfDestruct,
  forfeit
}) => {




///////// default attack card //////////////////////////////////////////////

  const phaserCharge: CardType[] = [{
    name: 'Phaser Charge',
    damage: 10,
    armor: 0,
    description: 'last-resort shield-to-phaser power conversion',
    id: 666
  }]

/////////// discard a card /////////////////////////////////////////
const discard = (cardName: any) =>{

  setPlayerHand(playerHand.filter(card=>card.name!==cardName))

}
// console.log("PLAYER HAND LENGTH", playerHand.length)

/////// check if out of cards //////////////////////////////////////////

// console.log("CARD TO REPLACE IN GAME DECK", cardReplacement)

if (reloaded && cardReplacement[0].user_id === user.id){
  console.log("RELOADED!")
  setGameDeck(gameDeck.concat(cardReplacement[0].card))
  setReloaded(false)
  setCardReplacement([])
}

// console.log("GAME DECK", gameDeck)


if (playerHand.length < 3 && gameDeck.length > 0){
 
  let nextCard = [gameDeck.pop()]
  // console.log("NEXT CARD", nextCard)
  setPlayerHand(playerHand.concat(nextCard))
}

if (playerHand.length <= 0){
  setPlayerHand(playerHand.concat(phaserCharge))
}

// console.log("USER:::", user)
// console.log("GAMEBOARD ENEMY HAND", enemyHand)

//////////////////////////////////////////////////////
  return (
    <div className='grid-cols-3 mt-10 pl-20 p-5 pt-15 min-h-screen w-screen flex flex-row bg-black-hole bg-cover'>
      {/* FIRST COLUMN*/}
      <div className='flex flex-col gap-3 space-between' style={{maxWidth: "25%"}}>
        {/* FIRST COLUMN 1st SECTION */}
        <div className='flex flex-col justify-items-center'>
          <div className='text-white'>Encounter {session} vs {enemyName}</div>
          <div className='pt-10 text-white sm:'>TIME: 00:00 / ROUND {roundDisplay}</div>
        </div>
        {/* FIRST COLUMN 2nd SECTION */}
        <div className='flex pt-10'>
          {/* USERS SHIP*/}
          <img src='https://i.imgur.com/V6LW3e4.png' className='object-cover scale-x-[-.75] scale-y-[.75] max-h-50 outline outline-blue-600 rounded-full animate-outline-pulse'/>
        </div>
        {/* FIRST COLUMN 3rd SECTION */}
        <div className=''>
          <div className='text-green-600 font-bold text-center pb-2'>{user.name}</div>
          <div className="w-full bg-gray-200 flex flex-grow flex-col gap-4 justify-items-end">
            <div className='bg-slate-700 h-5 rounded-full text-center justify-items-center text-white text-sm pt-5 relative'>
              <div className="bg-blue-400 h-5 rounded-full text-center justify-items-center text-white text-sm pt-5 absolute inset-y-0"
                style={{ width: `${(armor/100) * 100}%` }}>
              </div>
              <div className='pl-4 h-5 justify-items-center flex-1 text-center whitespace-nowrap text-xs sm:text-sm inset-y-0 absolute'>{`Armor: ${armor}`}</div>
            </div>
            <div className='flex bg-slate-600 h-5 rounded-full text-center relative justify-items-center text-white text-sm '>
              <div className="bg-error h-5 rounded-full text-center justify-items-end text-white text-sm"
                style={{ width: `${(hitPoints / 50) * 100}%` }}
              ></div>
              <div className='pl-4 h-4 flex-1 justify-items-center whitespace-nowrap justify-center text-center text-sm inset-y-0 absolute'>{`Hull Integrity: ${hitPoints} / 50`}</div>
            </div>
            <ActionSelect
              playerAction={playerAction}
              enemyLastAction={enemyLastAction}
              cardToPlay={cardToPlay}
              turnEnded={turnEnded}
              activeLoading={activeLoading}
              actionClick={actionClick}
              enemyCard={enemyCard}
              enemyTurnEnd={enemyTurnEnd}
            />
          </div>
        </div>
      </div>
      {/* 2ND COLUMN CARDS DISPLAY SECTION */}
      <div className="flex-col flex space-between" style={{ maxWidth: "50%" }}>
        {/* 2ND COL: 1ST SECT : ENEMY CARDS */}
        <div className="flex flex-row justify-items-center space-between items-center flex-grow" style={{ maxHeight: "33%", maxWidth: "100%" }}>
          {enemyHand.map((card, index) => (
            <img
              src="https://i.imgur.com/Uvf7DCN.png"
              className="scale-[.85] border-8 border-slate-600 rounded-lg shadow-md p-0 m-1 w-30 h-40 lg:w-40 lg:h-60 md:w-36 md:h-48 sm:w-32 sm:h-44 xl:w-52 xl:h-64 flex flex-col items-center justify-between"
              key={index}
            />
          ))}
        </div>
        {/* 2ND COL: 2ND SECT : PLAYED CARDS STATUS */}
        <div className='flex flex-row items-start' style={{ maxHeight: "33%", maxWidth: "50%" }}>
          {/* ENEMY STATUS */}
          <div className='flex flex-col justify-center items-start'>
            {enemyArmed ? (
              <div className='p-5 text-md text-red-500'>ENEMY STATUS: ARMED</div>
            ) : (
              <div className='p-5 text-md text-gray-500 whitespace-nowrap'>ENEMY STATUS: ARMED</div>
            )}
          </div>

          {/* USER'S SELECTED CARD */}
          <div className='pt-10 m-2 items-end' style={{ maxHeight: "33%", maxWidth: "50%" }}>
            {cardToPlay ? (
              <div className="bg-white border-8 border-red-500 rounded-lg shadow-md p-0 m-1 w-20 h-30 sm:w-16 sm:h-24 flex flex-col justify-between hover:scale-110">
                <h2 className="text-lg text-black font-bold mb-2 text-center">{cardToPlay[0]}</h2>
                <div className="text-center">
                  <div>`IMAGE`</div>
                  <p className="text-black mb-1">
                    <strong>Attack:</strong> {cardToPlay[1]}
                  </p>
                  <p className="text-black mb-1">
                    <strong>Defense:</strong> {cardToPlay[2]}
                  </p>
                  <p className="text-black mb-1">
                    <strong>Duration:</strong> {cardToPlay[5] ? cardToPlay[5] : 0}
                  </p>
                </div>
                <p className="text-black text-sm text-center">{cardToPlay[3]}</p>
              </div>
            ) : (
              <div className='border-4 border-gray-500 rounded-lg shadow-md p-4 m-2 w-30 h-40 flex flex-col text-[1rem] text-green-500'>
                <div className='pt-15'>MUNITION STATUS:</div>
              </div>
            )}
          </div>
        </div>
       {/* 2ND COLUMN: 3RD SECT: USERS CARDS */}
        <div className="flex flex-row justify-center gap-1 p-2 pt-5">
          {playerHand.map((card, index) => {
            return (
              <Card
                key={index}
                card={card}
                setCardToPlay={setCardToPlay}
                setCardId={setCardId}
                playerAction={playerAction}
                setActiveLoading={setActiveLoading}
                playerHand={playerHand}
                setPlayerHand={setPlayerHand}
                user={user}
                activeLoading={activeLoading}
              />
            );
          })}
        </div>
      </div>
      {/* 3RD COLUMN */}
      <div className='flex flex-col w-full' style={{maxWidth: "25%"}}>
        {/* 3RD COLUMN: 1ST SECTION */}
        <div className='flex flex-col items-center'>
          <div className='text-error font-bold text-center'>{enemyName || 'No Player'}</div>
          <div className="w-full flex flex-grow flex-col gap-4 justify-items-end">
            <div className='bg-slate-600 h-5 rounded-full text-center relative justify-items-end text-white text-sm'>
              <div
                className="bg-error h-5 rounded-full text-center justify-items-end text-white text-sm"
                style={{ width: `${(enemyHitPoints / 50) * 100}%` }}>
              </div>
              <div className='pl-4 h-5 justify-items-center text-center inset-y-0 absolute'>{`Hull Integrity: ${enemyHitPoints} / 50`}</div>
            </div>
            <div className='bg-slate-700 h-5 rounded-full text-center justify-items-end justify-end items-end text-white text-sm pt-5 relative'>
              <div
                className="bg-blue-400 h-5 rounded-full text-center justify-items-end justify-end items-end text-white text-sm pt-5 absolute inset-y-0"
                  style={{ width: `${(enemyArmor/100) * 100}%` }}>
              </div>
              <div className='pl-4 h-5 justify-items-center text-center inset-y-0 absolute'>{`Armor: ${enemyArmor}`}</div>
            </div>
          </div>
        </div>
        <div className='flex pt-20'>
           <div className='justify-center h-50 w-60'>
              <img src='https://i.imgur.com/V6LW3e4.png' className='z-1 scale-x-[-.75] scale-y-[.75] max-h-50 outline outline-blue-600 rounded-full animate-outline-pulse'/>
            </div>
        </div>
        <div className='flex flex-col items-center p-4 pt-10'>
          <div>
               {
             // !turnEnded || playerAction !== '' ?
             ((playerAction === 'FIRE' || playerAction === 'BLOCK' || (playerAction === 'LOAD' && activeLoading)) && !turnEnded) || (turnEnded && enemyAction)?
             <button className='p-4 flex items-end rounded-md justify-end bg-emerald-500  hover:bg-emerald-900 text-white font-bold focus:ring-4 focus:ring-emerald-600 '
               onClick={(e)=>{
                 setTurnEnded(true)
                 endTurn()
                 if (playerAction === 'FIRE'){
                     setCardToPlay(null)
                     // discard(cardToPlay[0])
                 }
                 if (playerAction === "LOAD" && cardToPlay[2]){
                   setCardToPlay(null)
                   discard(cardToPlay[0])
                 } else if (playerAction === "LOAD" && cardToPlay[1]){
                   discard(cardToPlay[0])
                 }
               }}>COMMIT TURN</button>
             :
             <button className='cursor-not-allowed p-4 flex items-end justify-end bg-gray  text-white font-bold rounded-md'
             >COMMIT TURN</button>
               }
           </div>
           <div className='items center flex flex-col pt-10'>
             {enemyWaiting?
               <div className='text-error text-[1rem] text-center animate-pulse' >
                 opponent waiting
               </div>
            :
             null
           }
           
           <label className="inline-flex items-center cursor-pointer">
           <input type="checkbox" value={selfDestruct} className="sr-only peer" onClick={()=>{setSelfDestruct(!selfDestruct)}}/>
             <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 dark:peer-focus:ring-orange-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-orange-600"></div>
             <span className="ms-3 text-sm font-medium text-white dark:text-white">ARM SELF DESTRUCT</span>
           </label>
           <br></br>
          {selfDestruct?
            <button onClick={forfeit} className='p-4 flex items-end justify-end bg-orange-500  hover:bg-orange-900 text-white font-bold focus:ring-4 focus:ring-orange-600 '>SELF DESTRUCT</button>
          :
            <button className='cursor-not-allowed p-4 flex items-end justify-center bg-gray text-white text-center font-bold rounded-md'
              >SELF DESTRUCT
            </button>
           }
           </div>
           </div>
      </div>
    </div>
  )
};

export default GameBoard;


