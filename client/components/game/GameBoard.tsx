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
  roundActual: any
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
  roundActual,
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
  // setPlayerHand(playerHand.concat(nextCard))
  setPlayerHand(playerHand)
}

if (playerHand.length <= 0){
  setPlayerHand(playerHand.concat(phaserCharge))
}

// console.log("USER:::", user)
// console.log("GAMEBOARD ENEMY HAND", enemyHand)

//////////////////////////////////////////////////////
  return (

    <div className='mt-10 p-5 pt-15 z-5 grid-cols-3 z-10 h-screen w-full flex space-between flex-col bg-black-hole bg-cover'>
   <div className='flex flex-row justify-between gap-1 p-1 h-60'>
        <div className='pr-4 flex flex-col flex-grow px-4'>
          <div className='pt-10 px-4 text-white'>Encounter {session} vs {enemyName}</div>
          {/* <div className='pt-10 px-4 text-white'></div> */}
          <div className='pt-10 px-4 text-white'>TIME: 00:00 / ROUND {roundActual}</div>
        </div>
        <div className="flex flex-row justify-center items-center flex-grow">
          {enemyHand.map((card, index) => (
            <>
            {/* {console.log("MAP INDEX", index, "ENEMY HAND IN MAP:", enemyHand)} */}
          <img src='https://i.imgur.com/Uvf7DCN.png' className="scale-[.85] border-8 border-slate-600 rounded-lg shadow-md p-0 m-2 w-45 h-60 z-0 flex flex-col items-center justify-between "
          key={index}
          />
          </>
          ))}
        </div>

        <div className='pt-5 flex-col min-w-60 flex flex-grow z-0'>
          <div className='text-error font-bold text-center'>{enemyName || 'No Player'}</div>
            <div className="w-full bg-gray-200 flex flex-grow flex-col gap-4 justify-items-end">
              <div className='bg-slate-600 h-5 rounded-full text-center relative justify-items-end text-white text-sm z-0'>
                <div
                  className="bg-error h-5 rounded-full text-center justify-items-end text-white text-sm z-10"
                  style={{ width: `${(enemyHitPoints / 50) * 100}%` }}>
                  </div>
                <div className='pl-4 z-11 h-5 justify-items-center text-center inset-y-0 absolute'>{`Hull Integrity: ${enemyHitPoints} / 50`}</div>
              </div>
          <div className='bg-slate-700 h-5 rounded-full text-center justify-items-end justify-end items-end text-white text-sm pt-5 relative'>
            <div
                className="bg-blue-400 h-5 rounded-full text-center justify-items-end justify-end items-end text-white text-sm pt-5 absolute inset-y-0"
                style={{ width: `${(enemyArmor/100) * 100}%` }}>
              </div>
              <div className='pl-4 z-11 h-5 justify-items-center text-center inset-y-0 absolute'>{`Armor: ${enemyArmor}`}</div>
          </div>
        </div>
        </div>
      </div>
      <div className='flex flex-row justify-between p-3 h-86'>
        <div>
          <div className='justify-center z-1 h-50 w-60'>
              <img src='https://i.imgur.com/V6LW3e4.png' className='z-1 scale-x-[-.75] scale-y-[.75] outline outline-blue-600 rounded-full animate-outline-pulse'/>
            </div>
        </div>
        <div className='flex flex-row justify-between h-70'>
          <div>
            {enemyArmed?
              <div className='p-20 text-[2rem] text-error'>ENEMY STATUS: ARMED</div>
              :
              <div className='p-20 text-[2rem] text-gray'> ENEMY STATUS: </div>
            }
          </div>
          <div>
            {cardToPlay?
              <div className="bg-white border-8 border-error rounded-lg shadow-md p-4 m-2 w-40 h-60 flex flex-col items-center justify-between hover:scale-110">
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
                    <strong>Duration:</strong> {cardToPlay[5]? cardToPlay[5] : 0}
                 </p>
                </div>
                <p className="text-black text-sm text-center">{cardToPlay[3]}</p>
              </div>
              :
              <div className='border-4 border-gray rounded-lg shadow-md p-4 m-2 w-40 h-60 flex flex-col text-[1rem] text-green-500'><div className='pt-15'>MUNITION STATUS:</div> </div>
            }
          </div>
        </div>
        <div>
          <div className='z-1 h-50 w-60'>
            <img src='https://i.imgur.com/4paq921.png' className='scale-x-[.75] scale-y-[.75]'/>
            </div>
        </div>
      </div>
      <div className='flex flex-row justify-between p-3'>
        <div className='flex flex-col p-3'>
          <div className='text-green-600 font-bold text-center pb-2'>{user.name}</div>

          <div className="w-full bg-gray-200 flex flex-grow flex-col gap-4 justify-items-end">
            <div className='bg-slate-700 h-5 rounded-full text-center justify-items-center text-white text-sm pt-5 relative'>
              <div
                className="bg-blue-400 h-5 rounded-full text-center justify-items-center text-white text-sm pt-5 absolute inset-y-0"
                style={{ width: `${(armor/100) * 100}%` }}>
              </div>
              <div className='pl-4 z-11 h-5 justify-items-center text-center inset-y-0 absolute'>{`Armor: ${armor}`}</div>
            </div>
            <div className='bg-slate-600 h-5 rounded-full text-center relative justify-items-end text-white text-sm z-0'>
              <div
                className="bg-error h-5 rounded-full text-center justify-items-end text-white text-sm z-10"
                style={{ width: `${(hitPoints / 50) * 100}%` }}>
                </div>
              <div className='pl-4 z-11 h-5 justify-items-center text-center inset-y-0 absolute'>{`Hull Integrity: ${hitPoints} / 50`}</div>
            </div>
        </div>
          <br></br>
          <br></br>
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
        <div className="flex flex-row">
          {playerHand.map((card, index) => {
            return(
              <Card
              // discard={discard}
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
            )
          })}
        </div>
        <div className='flex flex-col p-4'>
          <div>
              {
            // !turnEnded || playerAction !== '' ?
            ((playerAction === 'FIRE' || playerAction === 'BLOCK' || (playerAction === 'LOAD' && activeLoading)) && !turnEnded) || (turnEnded && enemyAction)?
            <button className='p-4 flex items-end justify-end bg-emerald-500  hover:bg-emerald-900 text-white font-bold focus:ring-4 focus:ring-emerald-600 '
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
            <button className='cursor-not-allowed p-4 flex items-end justify-end bg-gray  text-white font-bold rounded-sm'
            >COMMIT TURN</button>
              }
          </div>
          <div>
            {enemyWaiting?
              <div className='text-error text-[1rem] text-center animate-pulse' >
                opponent waiting
              </div>
            :
            null
          }
          <br></br>
          <br></br>
          <label className="inline-flex items-center cursor-pointer">
            <input type="checkbox" value={selfDestruct} className="sr-only peer" onClick={()=>{setSelfDestruct(!selfDestruct)}}/>
            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 dark:peer-focus:ring-orange-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-orange-600"></div>
            <span className="ms-3 text-sm font-medium text-white dark:text-white">ARM SELF DESTRUCT</span>
          </label>
          <br></br>
          {selfDestruct?
          <button onClick={forfeit} className='p-4 flex items-end justify-end bg-orange-500  hover:bg-orange-900 text-white font-bold focus:ring-4 focus:ring-orange-600 '>SELF DESTRUCT</button>
          :
              <button className='cursor-not-allowed p-4 flex items-end justify-end bg-gray text-white font-bold rounded-md'
              >SELF DESTRUCT</button>
          }
          </div>
        </div>
      </div>
    </div>
  )
};

export default GameBoard;

///////////////////////////////////////////////
