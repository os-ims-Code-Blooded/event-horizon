import React, { FC, act, useState } from 'react';
import Card from './Card';
import ActionSelect from './ActionSelect';
import FxText from './FxText';

// import Gameplay from './Gameplay';


interface CardType {
  name: string;
  damage: number;
  armor: number;
  description: string;
  id: number;
  duration: number;
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
  cardsRemain: any
  setCardsRemain: any

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
  setIsClicked: any
  isClicked: any;
  discard: any
  setSelfDestruct: any
  selfDestruct: any
  forfeit: any

  userRound: any
  enemyRound: any
  myPrevRound: any
  theirPrevRound: any
  shieldBarShake: Boolean
  healthBarShake: Boolean
  volume: any
  playCardSFX: any
  playSwitchSFX: any
  roundSoundsPlayed: any
  setRoundSoundsPlayed: any
  soundVolume: any
  

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
  setIsClicked,
  isClicked,

  playerAction,
  setPlayerAction,
  cardToPlay,
  setCardToPlay,
  setCardId,
  cardReplacement,
  setCardReplacement,
  reloaded,
  setReloaded,
  cardsRemain,
  setCardsRemain,

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
  forfeit,

  userRound,
  enemyRound,
  myPrevRound,
  theirPrevRound,
  healthBarShake,
  shieldBarShake,
  volume,

  playCardSFX,
  playSwitchSFX,
  roundSoundsPlayed,
  setRoundSoundsPlayed,
  soundVolume

}) => {


  //////// SFX //////////////////////////////////////////




///////// default attack card //////////////////////////////////////////////

  const phaserCharge: CardType[] = [{
    name: 'Phaser Charge',
    damage: 10,
    armor: 0,
    duration: 0,
    description: 'last-resort shield-to-phaser power conversion',
    id: 5
  }]

/////////// discard a card /////////////////////////////////////////
const discard = (cardName: any) =>{

  setPlayerHand(playerHand.filter(card=>card.name!==cardName))

}
// console.log("PLAYER HAND LENGTH", playerHand.length)

/////// check if out of cards //////////////////////////////////////////

// console.log("CARD TO REPLACE IN GAME DECK", cardReplacement)

if (reloaded && cardReplacement[0].user_id === user.id){
  // console.log("RELOADED!")
  setGameDeck(gameDeck.concat(cardReplacement[0].card))
  setReloaded(false)
  setCardReplacement([])
}

// console.log("GAME DECK", gameDeck)


if (playerHand.length < 3 && gameDeck.length > 0){
 
  // let nextCard = [gameDeck.pop()]
  // console.log("NEXT CARD", nextCard)
  // setPlayerHand(playerHand.concat(nextCard))
  setPlayerHand(playerHand)
}

if (playerHand.length <= 0){
  setPlayerHand(playerHand.concat(phaserCharge))
}

// console.log("USER:::", user)
// console.log("GAMEBOARD ENEMY HAND", enemyHand)

///////////////////////////////////////////////////////
  return (
    <div className='box-border grid grid-cols-[1fr_50%_1fr] pb-5 pr-2 pl-2 max-h-screen max-w-screen h-screen w-screen justify-between gap-10 flex-row bg-starfield-light dark:bg-starfield bg-center bg-cover'>
      {/* FIRST COLUMN*/}
      <div className='pt-10 grid grid-cols-1 m-2 flex-col h-[1/3] max-h-screen max-w-[25vw] justify-between'>
        {/* FIRST COLUMN 1st SECTION */}
        <div className='flex flex-col gap-3' style={{height: "33%"}}>
          <div className='text-text dark:text-darkText whitespace-nowrap text-sm sm:text-xs'>Encounter {session} <span className='text-fifth font-extrabold'>VS</span> {enemyName}</div>
          <div className='text-text dark:text-darkText text-sm sm:text-xs'><span className='text-fifth'>ROUND</span>: <span className='text-success font-extrabold'>{roundActual}</span></div>
          {theirPrevRound.length && myPrevRound.length?
            <div>STATUS REPORT:
            <FxText
                enemyName={enemyName}
                cardToPlay={cardToPlay}
                user={user}
                myPrevRound={myPrevRound}
                theirPrevRound={theirPrevRound}
                turnEnded={turnEnded}
                setRoundSoundsPlayed={setRoundSoundsPlayed}
                roundSoundsPlayed={roundSoundsPlayed}
                soundVolume={soundVolume}
                volume={volume}
            />

            </div>

            :
            // null
            <div>
              <div className='bg-slate-400 flex flex-col p-1 gap-1 border-4 border-slate-600 rounded-lg shadow-md w-2/3'>STATUS REPORT:</div>

            </div>
            }
        </div>
        {/* FIRST COLUMN 2nd SECTION */}
        <div className='flex h-[1/3]'>
          {/* USERS SHIP*/}
          <img src='https://i.imgur.com/V6LW3e4.png' className='h-full w-full aspect-square object-scale-down scale-x-[-.75] scale-y-[.75] rounded-full animate-outline-pulse'/>
        </div>
        {/* FIRST COLUMN 3rd SECTION */}
        <div className='' style={{height: "33%"}}>
          <div className='text-green-600 font-bold underline decoration-solid text-center pb-2'>{user.name} <span className='text-slate-400 font-bold'>[{user.score}]</span></div>
          <div className="w-full bg-gray-200 flex flex-grow flex-col gap-4 justify-items-end">
            <div className={`bg-slate-500 dark:bg-slate-600 h-5 rounded-full text-center justify-items-center text-text dark:text-darkText text-sm pt-5 relative ${ armor === 0 ? 'animate-pulse' : ''} ${shieldBarShake ? 'animate-shake transition-all' : ''}`}>
              <div className={`bg-blue-400 h-5 rounded-full text-center justify-items-center text-text dark:text-darkText text-sm pt-5 absolute inset-y-0 ${shieldBarShake ? 'animate-shake transition-all' : ''}`}
                style={{ width: `${(armor/100) * 100}%` }}>
              </div>
              <div className='pl-4 h-5 justify-items-center flex-1 text-text dark:text-darkText text-center whitespace-nowrap text-sm sm:text-xs inset-y-0 absolute'>{`Armor: ${armor}`}</div>
            </div>
            <div className={`flex bg-slate-500 dark:bg-slate-600 h-5 rounded-full text-center relative justify-items-center text-white text-sm ${healthBarShake ? 'animate-shake transition-all' : ''}`}>
              <div className={`bg-error h-5 rounded-full text-center justify-items-end text-text dark:text-darkText text-sm sm:text-xs transition-all ${ hitPoints <= 25 ? 'animate-pulse' : ''} ${healthBarShake ? 'animate-shake transition-all' : ''}`}
                style={{ width: `${(hitPoints / 50) * 100}%` }}
              ></div>
              <div className='pl-4 h-4 flex-1 justify-items-center text-text dark:text-darkText whitespace-nowrap justify-center text-center text-sm sm:text-xs inset-y-0 absolute'>{`Hull Integrity: ${hitPoints} / 50`}</div>
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
              volume={volume}
              
            />
          </div>

          <div className='h-4'></div>
          <div className='text-sm'>cards remaining: {cardsRemain}</div>

        </div>
      </div>




      {/* 2ND COLUMN CARDS DISPLAY SECTION */}
      <div className="grid grid-rows-[1fr_1fr_50%] grid-cols-1 max-h-screen h-full pt-10">
        {/* 2ND COL: 1ST SECT : ENEMY CARDS */}
        <div className='w-full h-[1/2] flex-row flex col-span-1 justify-center gap-1 p-2'>
          {enemyHand.map((card, index) => (
            <img
              src="https://i.imgur.com/Uvf7DCN.png"
              className="border-8 border-slate-600 rounded-lg shadow-md w-30 h-40 flex flex-col aspect-[3/4] items-center justify-between hover:scale-110"
              key={index}
            />
          ))}
        </div>
        {/* 2ND COL: 2ND SECT : PLAYED CARDS STATUS */}
        <div className='p-1 w-full col-span-1 flex flex-row justify-between'>

          {/* USER'S SELECTED CARD */}
          <div className='flex h-full w-full justify-center justify-items-center align-middle items-center'>
            {cardToPlay ? 
            <div className='flex h-full w-full'>
              {!turnEnded?
                (
                  <div className="bg-white border-4 border-success rounded-lg aspect-[3/4] shadow-md p-1 m-2 w-36 h-48 flex flex-col hover:scale-110"
                    onClick={() => {
                      if (playerAction === "LOAD" && !weaponArmed){

                        setCardToPlay(null);
                        setActiveLoading(false);
                        setIsClicked(null);
                        setPlayerAction(null);

                      }
                    }}
                  >
                    <h2 className="text-md text-black font-bold mb-2 text-center">{cardToPlay[0]}</h2>
                    <div className="text-center">
                      <div>`IMAGE`</div>
                      <p className="text-black mb-1 text-sm">
                        <strong>Attack:</strong> {cardToPlay[1]}
                      </p>
                      <p className="text-black mb-1 text-sm">
                        <strong>Defense:</strong> {cardToPlay[2]}
                      </p>
                      <p className="text-black mb-1 text-sm">
                        <strong>Duration:</strong> {cardToPlay[1] && cardToPlay[5] ? cardToPlay[5] + 1 : 1} {cardToPlay[2] ? cardToPlay[2] : null}
                      </p>
                    </div>
                    <p className="text-black text-sm text-center">{cardToPlay[3]}</p>
                  </div>
                )

                :

                (

                  <div className="bg-white border-4 border-success rounded-lg shadow-md p-1 m-2 w-36 h-48 aspect-[3/4] flex flex-col hover:scale-110">
                    <h2 className="text-md text-black font-bold mb-2 text-center">{cardToPlay[0]}</h2>
                    <div className="text-center">
                      <div>`IMAGE`</div>
                      <p className="text-black mb-1 text-sm">
                        <strong>Attack:</strong> {cardToPlay[1]}
                      </p>
                      <p className="text-black mb-1 text-sm">
                        <strong>Defense:</strong> {cardToPlay[2]}
                      </p>
                      <p className="text-black mb-1 text-sm">
                        <strong>Duration:</strong> {cardToPlay[1] && cardToPlay[5] ? cardToPlay[5] + 1 : 1} {cardToPlay[2] ? cardToPlay[2] : null}
                      </p>
                    </div>
                    <p className="text-black text-sm text-center">{cardToPlay[3]}</p>
                  </div>
                )

              }
            </div>
            :
            (
              <div className='border-4 rounded-lg border-success shadow-md p-4 m-2 w-36 h-48 flex flex-col text-[1rem] text-success'>
                <div className='pt-15'>MUNITION STATUS:</div>
              </div>
            )}
          </div>

          {/* ENEMY STATUS */}
          <div className='flex h-full w-full justify-center justify-items-center align-middle items-center'>

            {enemyArmed || (enemyLastAction === 'FIRE' && theirPrevRound[0].card_id  && theirPrevRound[0].damage) ?

                <div id='card' className='flex max-h-48 max-w-36' >
                    {enemyLastAction === 'FIRE' && theirPrevRound[0].card_id  && theirPrevRound[0].damage?
                         <div
                            className="cursor-not-allowed bg-white border rounded-lg shadow-md flex flex-col items-center justify-between w-full">
                            <h2 className="text-md text-black font-bold mb-2 text-center">{theirPrevRound[0].name}</h2>
                            <div className="text-center">
                                <div>`IMAGE`</div>
                                <p className="text-black mb-1 text-sm">
                                  <strong>Damage:</strong> {theirPrevRound[0].damage}
                                </p>
                                <p className="text-black mb-1 text-sm">
                                  <strong>Duration: {theirPrevRound[0].duration + 1 || 1}</strong>
                                </p>
                             </div>
                             <p className="text-black text-sm text-center">{theirPrevRound[0].description}</p>
                        </div>
                      :
                        <div className="shrink border-4 border-error rounded-lg shadow-md p-1 m-2 max-w-36 max-h-48 flex flex-col justify-between hover:scale-110">
                          <img
                            src="https://i.imgur.com/Uvf7DCN.png"
                            className="border-8 border-slate-600 rounded-lg shadow-md max-w-36 max-h-48 flex flex-col items-center justify-between hover:scale-110"
                            />
                         </div>
                    }
                </div>

            :
              <div className='border-4 border-error rounded-lg shadow-md p-1 m-2 w-36 h-48 flex flex-col text-[1rem] text-error' >
                <div className='pt-15' style={{maxWidth: "25%" }}>ENEMY MUNITION STATUS:</div>
              </div>
            }
          </div>
        </div>

       {/* 2ND COLUMN: 3RD SECT: USERS CARDS */}
        <div className="flex flex-row justify-center gap-1 p-2 h-[275px] w-full col-span-1">
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
                turnEnded={turnEnded}
                playCardSFX={playCardSFX}
                cardToPlay={cardToPlay}
                setIsClicked={setIsClicked}
                isClicked={isClicked}
              />
            );
          })}
        </div>
      </div>



      {/* 3RD COLUMN */}
      <div className='grid grid-cols-1 w-full h-full items-center max-h-screen max-w-[25vw] justify-between pt-5'>
        {/* 3RD COLUMN: 1ST SECTION */}
        <div className='flex flex-col items-center w-full h-[1/3]'>
          <div className='text-error font-bold underline text-sm sm:text-xs decoration-solid text-center'>{enemyName}</div>
          <div className="w-full flex flex-grow flex-col gap-4 justify-items-end">
            <div className={`bg-slate-500 dark:bg-slate-600 h-5 rounded-full text-center relative justify-items-end text-white text-sm ${healthBarShake ? 'animate-shake transition-all' : ''}`}>
              <div
                className={`bg-error h-5 rounded-full text-center justify-items-end text-text dark:text-darkText text-sm transition-all ${enemyHitPoints <= 25 ? 'animate-pulse': ''}${healthBarShake ? 'animate-shake transition-all' : ''}`}
                style={{ width: `${(enemyHitPoints / 50) * 100}%` }}>
              </div>
              <div className='pl-4 h-5 justify-items-center text-center text-text text-sm sm:text-xs dark:text-darkText inset-y-0 absolute'>{`Hull Integrity: ${enemyHitPoints} / 50`}</div>
            </div>
            <div className={`bg-slate-500 h-5 rounded-full text-center justify-items-end justify-end items-end text-white text-sm pt-5 relative ${enemyArmor === 0 ? 'animate-pulse' :  ''} ${shieldBarShake ? 'animate-shake transition-all' : ''}`}>
              <div
                className={`bg-blue-400 h-5 rounded-full text-center justify-items-end justify-end items-end text-white text-sm pt-5 absolute inset-y-0 transition-all ${shieldBarShake ? 'animate-shake transition-all' : ''}`}
                  style={{ width: `${(enemyArmor/100) * 100}%` }}>
              </div>
              <div className='pl-4 h-5 justify-items-center text-center text-text text-sm sm:text-xs dark:text-darkText inset-y-0 absolute'>{`Armor: ${enemyArmor}`}</div>
            </div>
          </div>
        </div>
        {/* 3RD COLUMN : SECTION 2 SHIP */}
        <div className='flex h-[1/3] justify-items-center items-center justify-end'>
              <img src='https://i.imgur.com/4paq921.png' className='aspect-square h-full w-full object-scale-down scale-x-[.75] scale-y-[.75] rounded-full animate-outline-pulse'/>
        </div>
        {/* 3RD COLUMN : SECTION 3 */}
        <div className='flex flex-col col-span-1 h-[1/3] w-full items-center'>
          <div className='flex shrink'>
               {
             // !turnEnded || playerAction !== '' ?
             ((playerAction === 'FIRE' || playerAction === 'BLOCK' || (playerAction === 'LOAD' && activeLoading)) && !turnEnded) || (turnEnded && enemyAction)?
             <button 
             className={`p-3 flex aspect-square text-text dark:text-darkText font-bold rounded-full text-sm sm:text-xs justify-center items-center overflow-hidden border-8 ${playerAction === "BLOCK" ? 'border-blue-600' : null} ${playerAction === "FIRE" ? 'border-red-600' : null }  ${playerAction === "LOAD" &&  activeLoading? 'border-yellow-300' : null } ${!playerAction?'border-slate-700' : null } text-ellipsis text-center justify-items-end bg-emerald-500 hover:border-slate-500 hover:bg-emerald-900 focus:ring-4 focus:ring-emerald-600 `}
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
             <button className='cursor-not-allowed p-3 flex bg-gray aspect-square border-8 border-slate-700 text-white font-bold rounded-full text-sm sm:text-xs justify-center items-center overflow-hidden text-ellipsis'
             >COMMIT TURN</button>
               }
           </div>
           <div className='items center flex flex-col pt-4'>
             {enemyWaiting?
               <div className='text-error text-[1rem] text-center animate-pulse' >
                 Opponent waiting
               </div>
            :
             null
           }
             {turnEnded && !enemyWaiting?
               <div className='text-amber-400 text-[1rem] text-center animate-pulse' >
                 Waiting for opponent
               </div>
            :
             null
           }

           <label className="inline-flex justify-items-center items-center cursor-pointer justify-between pb-2">
           <input type="checkbox" 
            value={selfDestruct} className="sr-only peer " 
            onClick={()=>{
              playSwitchSFX()
              setSelfDestruct(!selfDestruct)
            }}/>
             <div className="relative w-11 h-6 pb-1 bg-gray peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 dark:peer-focus:ring-orange-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-orange-600"></div>
             <span className="ms-3 text-sm sm:text-xs whitespace-nowrap font-medium text-text dark:text-darkText ">ARM SELF DESTRUCT</span>
           </label>
          <div></div>
          {selfDestruct?
            <button onClick={forfeit} className='p-1 pt-1 pb-1 flex shrink text-center text-sm sm:text-xs justify-items-center items-center justify-center animate-pulse bg-orange-500  hover:bg-orange-900 text-text dark:text-darkText font-bold rounded-md focus:ring-4 focus:ring-orange-600'
            >SELF DESTRUCT<img className='object-contain max-h-8' src='https://i.imgur.com/mBC4Uh5.png'/>
              </button>
          :
            <button className='cursor-not-allowed p-1 pt-1 pb-1 flex shrink text-center text-sm sm:text-xs justify-items-center items-center justify-center bg-gray text-text dark:text-darkText font-bold rounded-md'
              >SELF DESTRUCT<img className='object-contain max-h-8' src='https://i.imgur.com/mBC4Uh5.png'/>
            </button>
           }
           </div>
           </div>
      </div>
    </div>
  )
};

export default GameBoard;


