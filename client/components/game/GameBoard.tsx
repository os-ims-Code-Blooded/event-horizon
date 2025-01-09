import React, { FC, act, useState } from 'react';
import Card from './Card';
import ActionSelect from './ActionSelect';
import FxText from './FxText';
import Animations from './Animations';
import renderCardImage from '../cards/CardImageRenderer';
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
  socketRef: any
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
  socketRef,
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

if (reloaded && cardReplacement[0].user_id === user.id){
  setGameDeck(gameDeck.concat(cardReplacement[0].card))
  setReloaded(false)
  setCardReplacement([])
}



if (playerHand.length < 3 && gameDeck.length > 0){
  setPlayerHand(playerHand)
}

if (playerHand.length <= 0){
  setPlayerHand(playerHand.concat(phaserCharge))
}

///////////////////////////////////////////////////////
  return (
    <div className='box-border grid grid-cols-[1fr_50%_1fr] pb-5 pr-2 pl-2 h-screen w-screen justify-between gap-10 flex-row bg-starfield-light dark:bg-starboard bg-center bg-no-repeat bg-cover overflow-hidden' style={{backgroundRepeat: "no-repeat"}}>
      {/* FIRST COLUMN*/}
      <div className='pt-10 grid grid-cols-1 m-2 flex-col max-h-screen max-w-full'>
        {/* FIRST COLUMN 1st SECTION */}
        <div className='flex flex-col gap-3' style={{height: "15%"}}>
          <div className='text-text dark:text-darkText whitespace-nowrap text-xs sm:text-xs'>Encounter {session} <span className='text-fifth font-extrabold'>VS</span> {enemyName}</div>
          <div className='text-text dark:text-darkText text-xs sm:text-xs'><span className='text-fifth'>ROUND</span>: <span className='text-success font-extrabold'>{roundActual}</span></div>
          {/* {theirPrevRound.length && myPrevRound.length?
            <div className='text-xs'>STATUS REPORT:
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
              <div className='bg-slate-400 flex flex-col p-1 gap-1 border-4 border-slate-600 rounded-lg shadow-md w-2/3 text-xs'>STATUS REPORT:</div>

            </div>
            } */}
        </div>
        {/* FIRST COLUMN 2nd SECTION */}
         <div className='flex'>
          {/* USERS SHIP*/}
           {/* <img src='https://i.imgur.com/V6LW3e4.png' className='h-full w-full aspect-square object-scale-down scale-x-[-.75] scale-y-[.75] rounded-full animate-outline-pulse'/> */}
         </div>
        {/* FIRST COLUMN 3rd SECTION */}
        <div className='justify-items-center justify-end items-end sm:pt-10' style={{height: "33%"}}>
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
          <div className='text-md sm:text-sm xs:text-xs  text-text dark:text-darkText'>cards remaining: {cardsRemain}</div>
        </div>
      </div>




      {/* 2ND COLUMN CARDS DISPLAY SECTION */}
      <div className="grid grid-rows-[1fr_1fr_50%] grid-cols-1 max-h-screen h-auto pt-10">
        {/* 2ND COL: 1ST SECT : ENEMY CARDS */}
        <div className='flex flex-shrink w-auto h-auto flex-row col-span-1 justify-center gap-1 p-2 '>
          {enemyHand.map((card, index) => (
            <img
              src="https://i.imgur.com/Uvf7DCN.png"
              className="border-8 border-slate-600 rounded-lg shadow-md flex flex-shrink-0 
               aspect-[3/4] md:max-h-[12rem] md:max-w-[9rem] sm:max-h-[6rem] sm:max-w-[4.5rem] 
                xs:max-h-[4rem] xs:max-w-[3rem]"
              key={index}
            />
          ))}
        </div>
        {/* 2ND COL: 2ND SECT : PLAYED CARDS STATUS */}
        <div className='p-1 w-full col-span-1 flex flex-row justify-between'>

          {/* USER'S SELECTED CARD */}
          <div className='flex h-full w-full justify-center justify-items-center align-middle items-center'>
            {cardToPlay ? 
            <div>
              {!turnEnded?
                (
                  <div className="bg-white border-4 border-success rounded-lg aspect-[3/4] shadow-md p-1 m-2 md:max-h-[12rem] md:max-w-[9rem] sm:max-h-[6rem] sm:max-w-[4.5rem] 
                xs:max-h-[4rem] xs:max-w-[3rem] flex flex-col hover:scale-110 h-full w-full"
                    onClick={() => {
                      if (playerAction === "LOAD" && !weaponArmed){

                        setCardToPlay(null);
                        setActiveLoading(false);
                        setIsClicked(null);
                        setPlayerAction(null);

                      }
                    }}
                  >
                    <h2 className="text-xs sm:text-xs xs:text-xs text-black font-bold mb-2 text-center">{cardToPlay[0]}</h2>
                    <div className='justify-center justify-items-center align-middle items-center content-center w-full h-full fit'>
                      {renderCardImage({
                        damage: cardToPlay[1],
                        armor: cardToPlay[2]
                      })}
                    </div>
                    <div className="text-center text-xs flex-shrink">
                      <p className="text-black mb-1 sm:text-xs text-xs xs:text-xs">
                        { cardToPlay[1] ? (<><strong>Attack:</strong> {cardToPlay[1]}</>): (<><strong>Defense:</strong> {cardToPlay[2]}</>) }
                      </p>
                      <p className="text-black mb-1 sm:text-xs text-xs xs:text-xs">
                        <strong>Duration:</strong> {cardToPlay[2] ? cardToPlay[5] : cardToPlay[1] && cardToPlay[5] ? cardToPlay[5] + 1 : 1}
                      </p>
                    </div>
                  </div>
                )

                :

                (

                  <div className="bg-white border-4 border-success rounded-lg shadow-md p-1 m-2 aspect-[3/4] md:max-h-[12rem] md:max-w-[9rem] sm:max-h-[6rem] sm:max-w-[4.5rem] 
                xs:max-h-[4rem] xs:max-w-[3rem] flex flex-col hover:scale-110 h-full w-full">
                    <h2 className="text-xs sm:text-xs xs:text-xs text-black font-bold mb-2 text-center">{cardToPlay[0]}</h2>
                    <div className='justify-center justify-items-center align-middle items-center content-center w-full h-full fit'>
                      {renderCardImage({
                        damage: cardToPlay[1],
                        armor: cardToPlay[2]
                      })}
                    </div>
                    <div className="text-center text-xs flex-shrink">
                      <p className="text-black mb-1 sm:text-xs text-xs xs:text-xs">
                        { cardToPlay[1] ? (<><strong>Attack:</strong> {cardToPlay[1]}</>): (<><strong>Defense:</strong> {cardToPlay[2]}</>) }
                      </p>
                      <p className="text-black mb-1 sm:text-xs text-xs xs:text-xs">
                        <strong>Duration:</strong> {cardToPlay[2] ? cardToPlay[5] : cardToPlay[1] && cardToPlay[5] ? cardToPlay[5] + 1 : 1}
                      </p>
                    </div>
                  </div>
                )

              }
            </div>
            :
            (
              <div className='border-4 border-success rounded-lg shadow-md p-1 m-2 aspect-[3/4] md:max-h-[12rem] md:max-w-[9rem] sm:max-h-[6rem] sm:max-w-[4.5rem] 
              xs:max-h-[4rem] xs:max-w-[3rem] flex flex-col text-[1rem] text-success h-full w-full' >
              <div className='pt-15 text-sm sm:text-xs text-wrap' style={{maxWidth: "25%" }}> MUNITION STATUS:</div>
            </div>
            )}
          </div>

            {/* ANIMATIONS */}
            
            <div id="hits" className='inset-0 flex z-45 w-1/2 h-1/ justify-center items-center place-items-center'>
            {theirPrevRound.length && myPrevRound.length?
            <Animations
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
            :
              null
            }
            </div>


          {/* ENEMY STATUS */}
          <div className='flex h-full w-full justify-center justify-items-center align-middle items-center'>

            {enemyArmed || (enemyLastAction === 'FIRE' && theirPrevRound[0].card_id  && theirPrevRound[0].damage)?

                <div id='card' className='flex max-w-30 max-h-40 aspect-[3/4] md:max-h-[12rem] md:max-w-[9rem] sm:max-h-[6rem] sm:max-w-[4.5rem] 
                xs:max-h-[4rem] xs:max-w-[3rem]' >

                    {enemyLastAction === 'FIRE' && theirPrevRound[0].card_id  && theirPrevRound[0].damage?
                         <div
                            className="cursor-not-allowed bg-white rounded-lg shadow-md border-4 border-error flex flex-col items-center justify-between w-full">
                            
                             <h2 className="text-xs sm:text-xs xs:text-xs text-black font-bold mb-2 text-center">{theirPrevRound[0].name}</h2>
                              <div className='justify-center justify-items-center align-middle items-center content-center w-full h-full fit'>
                                {renderCardImage({
                                  damage: theirPrevRound[0].damage,
                                  armor: theirPrevRound[0].armor
                                })}
                              </div>
                              <div className="text-center text-xs flex-shrink">
                                <p className="text-black mb-1 text-xs">
                                  <strong>Damage:</strong> {theirPrevRound[0].damage}
                                </p>
                                <p className="text-black mb-1 sm:text-xs text-xs xs:text-xs">
                                  <strong>Duration:</strong> {theirPrevRound[0].duration + 1 || 1}
                                </p>
                              </div>
                        </div>
                      :
                        <div className="border-4 border-error rounded-lg shadow-md p-1 m-2 flex flex-col h-fit w-fit justify-between hover:scale-110">
                          <img
                            src="https://i.imgur.com/Uvf7DCN.png"
                            className="border-8 border-slate-600 rounded-lg shadow-md aspect-[3/4] md:max-h-[12rem] md:max-w-[9rem] sm:max-h-[6rem] sm:max-w-[4.5rem] 
                xs:max-h-[4rem] xs:max-w-[3rem] flex flex-col items-center justify-between hover:scale-110"
                            />
                         </div>
                    }



                </div>

            :
              <div className='border-4 border-error rounded-lg shadow-md p-1 m-2 aspect-[3/4] md:max-h-[12rem] md:max-w-[9rem] sm:max-h-[6rem] sm:max-w-[4.5rem] 
                xs:max-h-[4rem] xs:max-w-[3rem] flex flex-col text-[1rem] text-error' >
                <div className='pt-15 text-sm sm:text-xs text-wrap' style={{maxWidth: "25%" }}>ENEMY MUNITION STATUS:</div>
              </div>
            }
          </div>
        </div>

       {/* 2ND COLUMN: 3RD SECT: USERS CARDS */}
        <div className="flex flex-row flex-shrink justify-center gap-1 p-2 h-full col-span-1  ">
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
      <div className='grid grid-cols-1 w-full h-full items-center max-h-screen max-w-full pt-10'>
        {/* 3RD COLUMN: 1ST SECTION */}
        <div className='flex flex-shrink flex-col pt-6 w-full h-full max-h-full justify-items-start justify-start'>
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
        <div className='flex'>
              {/* <img src='https://i.imgur.com/4paq921.png' className='aspect-square h-full w-full object-scale-down scale-x-[.75] scale-y-[.75] rounded-full animate-outline-pulse'/> */}
        </div>
        {/* 3RD COLUMN : SECTION 3 */}
        <div className='flex flex-shrink flex-col col-span-1 h-auto w-full items-center max-h-[1/3]'>
          <div className='flex shrink h-auto w-auto'>
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
             <button className='cursor-not-allowed p-3 flex md:h-30 md:w-30 sm:h-26 sm:w-26 xs:h-22 xs:w-22 lg:h-34 lg:w-34 bg-gray aspect-square border-8 border-slate-700 text-white font-bold rounded-full text-sm sm:text-xs justify-center items-center overflow-hidden text-ellipsis'
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
             <div className="relative w-11 h-6 pb-1 bg-gray peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 dark:peer-focus:ring-orange-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-orange-600"></div>
             <span className="ms-3 text-sm sm:text-xs whitespace-nowrap font-medium text-text dark:text-darkText ">ARM SELF DESTRUCT</span>
           </label>
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


