import React, { FC } from 'react';
import Card from './Card';
import ActionSelect from './ActionSelect';
// import Gameplay from './Gameplay';


interface CardType {
  name: string;
  attack: number;
  defense: number;
  description: string;
}
type GameBoardProp = {
  session: string;
  socket: any
  endTurn: any
  setPlayerAction: any
  setCardToPlay: any
  setWeaponArmed: any
  hitPoints: number
}

const GameBoard: FC <GameBoardProp> = ({ 
  session, 
  socket, 
  endTurn, 
  setPlayerAction, 
  setCardToPlay, 
  setWeaponArmed, 
  hitPoints 
}) => {
  const playerCards: CardType[] = [
    {
      name: 'Bomba',
      attack: 15,
      defense: 0,
      description: 'Increase Attack Power of your bullet',
    },
    {
      name: 'Rocket',
      attack: 20,
      defense: 0,
      description: 'Explosive attack dealing area damage.',
    },
    {
      name: 'Plasma Shield',
      attack: 0,
      defense: 15,
      description: 'Increase Defense Power of your shield',
    },
  ];

  const opponentCards: CardType[] = [
    {
      name: 'Laser Beam',
      attack: 25,
      defense: 0,
      description: 'Powerful attack with laser precision.',
    },
    {
      name: 'Energy Shield',
      attack: 0,
      defense: 20,
      description: 'Increases defense against all attacks.',
    },
    {
      name: 'Missile',
      attack: 30,
      defense: 0,
      description: 'A high-damage explosive attack.',
    },
  ];

  const armCard = (e) =>{
    setCardToPlay()
  }

  return (
    <div className='flex-grow flex-col bg-slate-700 dark:bg-black scale-85'>
      <div className='flex flex-row justify-between p-3'>
        <div>
          <div className='p-2'>TIME: 00:00 / ROUND 1</div>
        </div>
        <div className="flex flex-row">
          {opponentCards.map((card, index) => (
          <div className="bg-slate-500 border rounded-lg shadow-md p-4 m-2 w-40 h-60 flex flex-col items-center justify-between">
          </div>
          ))}
        </div>
        <div>
          <div className='text-red-800 font-bold'>OPPONENT NAME</div>
          <div className='text-red-600 font-bold'> 100/100 HP</div>
        </div>
      </div>
      <div className='flex flex-row justify-between p-3 h-86'>
        <div>
          <div className='justify-center p-20'>USERS SHIP IMAGE</div>
        </div>
        <div className='flex flex-row justify-between h-70'>
          <div>
            <div className='p-20 text-[2rem]'> OPPONENTS SELECTED CARD </div>
          </div>
          <div>
            <div className='p-20 text-[2rem]'> USERS SELECTED CARD</div>
          </div>
        </div>
        <div>
          <div className='p-20'> OPPONENTS SHIP IMAGE</div>
        </div>
      </div>
      <div className='flex flex-row justify-between p-3'>
        <div className='flex flex-col p-3'>
          <div className='text-green-600 font-bold'>USER NAME</div>
          <div className='text-blue-600 font-bold'>USER HP: 100/100</div>
          <br></br>
          <br></br>

          <ActionSelect 
          setPlayerAction={setPlayerAction} 
          setWeaponArmed={setWeaponArmed}
          />
        </div>


        <div className="flex flex-row">

              {playerCards.map((card, index) => (
                <Card 
                key={index} 
                card={card} 
                setCardToPlay={setCardToPlay}
                />
              ))}

        </div>


        <div>
         <button className='p-4 flex items-end justify-end bg-emerald-500  hover:bg-emerald-900 text-white font-bold focus:ring-4 focus:ring-emerald-600 ' 
        onClick={endTurn}>COMMIT TURN</button>
        </div>

      </div>
    </div>
  )
};

export default GameBoard;

