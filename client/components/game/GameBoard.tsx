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
}
type GameBoardProp = {
  session: string;
  socket: any
  user: any
  userDecks: any
  deckSelected: any
  endTurn: any
  playerAction: any
  setPlayerAction: any
  handSize: any

  enemyName: any
  enemyAction: any
  enemyWaiting: any
  enemyLastAction: any
  enemyHitPoints: number
  enemyArmor: number
  enemyCard: any
  enemyTurnEnd: any
  enemyArmed: any

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

  playerAction,
  setPlayerAction,
  cardToPlay,
  setCardToPlay,
  setCardId,
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


  const shuffle = array =>{
    for (let i = array.length - 1; i > 0; i--){
      let j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array
  }
  //////////////////////////////////
  // console.log("DECK SELECTED", deckSelected)

  const [gameDeck, setGameDeck] = useState(shuffle(deckSelected))

  const [playerHand, setPlayerHand] = useState(gameDeck.slice(0, 3))

  console.log("GD", gameDeck, "\nPH", playerHand)


///////////////////////////////////////////////////////

  const opponentCards: CardType[] = [
    {
      name: '',
      damage: 0,
      armor: 0,
      description: ''
    },
    {
      name: '',
      damage: 0,
      armor: 0,
      description: ''
    },
    {
      name: '',
      damage: 0,
      armor: 0,
      description: ''
    },
  ];

///////// default attack card //////////////////////////////////////////////

  const phaserCharge: CardType[] = [{
    name: 'Phaser Charge',
    damage: 10,
    armor: 0,
    description: 'last-resort shield-to-phaser power conversion'
  }]

/////////// discard a card /////////////////////////////////////////
const discard = (cardName: any) =>{

  setPlayerHand(playerHand.filter(card=>card.name!==cardName))

}
// console.log("PLAYER HAND LENGTH", playerHand.length)

/////// check if out of cards //////////////////////////////////////////

if (playerHand.length < 3 && gameDeck.length > 0){
 
  let nextCard = [gameDeck.pop()]
  // console.log("NEXT CARD", nextCard)
  setPlayerHand(playerHand.concat(nextCard))
}

if (playerHand.length <= 0){
  setPlayerHand(playerHand.concat(phaserCharge))
}

// console.log("USER:::", user)

//////////////////////////////////////////////////////
  return (
    <div className='p-5 z-5 grid-cols-3 z-10 h-full w-full flex space-between flex-col [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]'>
      <div className='flex flex-row justify-between gap-1 p-1'>
        <div className='pr-4 flex flex-grow'>
          <div className='pt-10 text-white'>TIME: 00:00 / ROUND {roundDisplay}</div>
        </div>
        <div className="flex flex-row justify-center items-center flex-grow">
          {opponentCards.map((card, index) => (

          <img src='https://i.imgur.com/y1g83zB.png' className="scale-[.75] rounded-lg shadow-md p-0 m-2 w-45 h-60 z-0 flex flex-col items-center justify-between "
          key={index}
            />


          ))}
        </div>





        <div className='pt-5 flex-col min-w-60 flex flex-grow'>
          <div className='text-red-800 font-bold'>{enemyName || 'No Player'}</div>





          <div className="w-full bg-gray-200 rounded-full h-4">
          <div
            className="bg-red-600 h-5 rounded-full text-center justify-items-center text-white text-sm"
            style={{ width: `${(enemyHitPoints / 50) * 100}%` }}>
              {`Hull Integrity: ${enemyHitPoints} / 50`}
            </div>
          <div
            className="bg-blue-400 h-5 rounded-full text-center justify-items-center text-white text-sm"
            style={{ width: `${(enemyArmor/100) * 100}%` }}>
              {`Armor: ${enemyArmor}`}
            </div>
        </div>


        </div>
      </div>




      <div className='flex flex-row justify-between p-3 h-86'>
        <div>
          <div className='justify-center z-1 h-50 w-60'>
              <img src='https://i.imgur.com/V6LW3e4.png' className='z-1 scale-x-[-.50] scale-y-[.50]'/>
            </div>
        </div>
        <div className='flex flex-row justify-between h-70'>


          <div>
            {enemyArmed?

              <div className='p-20 text-[2rem] text-red-600'>ENEMY STATUS: ARMED</div>

              :

              <div className='p-20 text-[2rem] text-red-600'> ENEMY STATUS: </div>

            }
          </div>


          <div>

            {cardToPlay?



    <div className="bg-white border-8 border-red-600 rounded-lg shadow-md p-4 m-2 w-40 h-60 flex flex-col items-center justify-between hover:scale-110">
      <h2 className="text-lg font-bold mb-2 text-center">{cardToPlay[0]}</h2>
      <div className="text-center">
        <div>`IMAGE`</div>
        <p className="text-gray-700 mb-1">
          <strong>Attack:</strong> {cardToPlay[1]}
        </p>
        <p className="text-gray-700 mb-1">
          <strong>Defense:</strong> {cardToPlay[2]}
        </p>
      </div>
      <p className="text-gray-600 text-sm text-center">{cardToPlay[3]}</p>
    </div>


              :

              <div className='p-20 text-[2rem] text-green-500'> MUNITION STATUS: </div>
          }
          </div>
        </div>
        <div>
          <div className='z-1 h-50 w-60'>
            <img src='https://i.imgur.com/4paq921.png' className='scale-x-[.50] scale-y-[.50]'/>
            </div>
        </div>
      </div>
      <div className='flex flex-row justify-between p-3'>
        <div className='flex flex-col p-3'>
          <div className='text-green-600 font-bold'>{user.name}</div>





          <div className="w-full bg-gray-200 rounded-full h-4">
          <div
            className="bg-blue-600 h-5 rounded-full text-center justify-items-center text-white text-sm"
            style={{ width: `${(hitPoints / 50) * 100}%` }}>
            {`Hull Integrity: ${hitPoints} / 50`}
          </div>
          <div
            className="bg-blue-400 h-5 rounded-full text-center justify-items-center text-white text-sm"
            style={{ width: `${(armor/100) * 100}%` }}>
            {`Armor: ${armor}`}
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

              {playerHand
                .map((card, index) => {
                  // console.log("CAAAARD", card)
          return(

            <Card
            // discard={discard}
            key={index}
            card={card}
            setCardToPlay={setCardToPlay}
            setCardId={setCardId}
            playerAction={playerAction}
            setActiveLoading={setActiveLoading}
            playerHand={undefined}                   />
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

            // console.log("click")

            setTurnEnded(true)

            endTurn()

            if (playerAction === 'FIRE'){
                setCardToPlay(null)
                discard(cardToPlay[0])
            }
            if (playerAction === "LOAD" && cardToPlay[2]){
              setCardToPlay(null)
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
              <div className='text-red-600 text-[1rem] text-center animate-pulse' >
                opponent waiting
              </div>
            :
            null
          }
          <br></br>
          <br></br>
          

          <label className="inline-flex items-center cursor-pointer">

            <input type="checkbox" value={selfDestruct} className="sr-only peer" onClick={()=>{setSelfDestruct(!selfDestruct)}}/>
            
            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 dark:peer-focus:ring-orange-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-orange-600"></div>

            <span className="ms-3 text-sm font-medium text-white dark:text-white">ARM SELF DESTRUCT</span>
          </label>

          <br></br>

          {selfDestruct?  

          <button onClick={forfeit} className='p-4 flex items-end justify-end bg-orange-500  hover:bg-orange-900 text-white font-bold focus:ring-4 focus:ring-orange-600 '>SELF DESTRUCT</button>

          :  
          
          
              <button className='cursor-not-allowed p-4 flex items-end justify-end bg-gray  text-white font-bold rounded-sm'
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
