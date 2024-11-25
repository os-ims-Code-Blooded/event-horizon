import React, { FC } from 'react';

interface CardType {
  name: string;
  attack: number;
  defense: number;
  description: string;
}

interface CardProps {
  card: CardType;
  setCardToPlay: any
  playerAction: any
  setActiveLoading: any

  playerHand: any
}

const Card: FC<CardProps> = ({ card, setCardToPlay, playerAction, setActiveLoading }) => {

  const cardSelect = (card: CardType) =>{

    setCardToPlay([card.name, card.attack, card.defense, card.description])
    setActiveLoading(true)
   

  }


  return (
    <>

    {playerAction === 'load' ?

    <div
    onClick={()=>cardSelect(card)}

    className="bg-white border-8 border-yellow-300 rounded-lg shadow-md p-4 m-2 w-40 h-60 flex flex-col items-center justify-between hover:scale-110"
    >

      <h2 className="text-lg font-bold mb-2 text-center">{card.name}</h2>

      <div className="text-center">
        <div>`IMAGE`</div>
        <p className="text-gray-700 mb-1">
          <strong>Attack:</strong> {card.attack}
        </p>
        <p className="text-gray-700 mb-1">
          <strong>Defense:</strong> {card.defense}
        </p>
      </div>
      <p className="text-gray-600 text-sm text-center">{card.description}</p>
    </div>

    :

    <div
    className="cursor-not-allowed bg-white border rounded-lg shadow-md p-4 m-2 w-40 h-60 flex flex-col items-center justify-between">

      <h2 className="text-lg font-bold mb-2 text-center">{card.name}</h2>

      <div className="text-center">
        <div>`IMAGE`</div>
        <p className="text-gray-700 mb-1">
          <strong>Attack:</strong> {card.attack}
        </p>
        <p className="text-gray-700 mb-1">
          <strong>Defense:</strong> {card.defense}
        </p>
      </div>
      <p className="text-gray-600 text-sm text-center">{card.description}</p>
    </div>
    }

    </>

  );
}
export default Card;
