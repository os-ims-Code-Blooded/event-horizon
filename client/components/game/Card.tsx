import React, { FC } from 'react';

interface CardType {
  card_id(card_id: any): unknown;
  duration: number;
  id: number;
  name: string;
  damage: number;
  armor: number;
  description: string;
}

interface CardProps {
  card: CardType;
  setCardToPlay: any
  setCardId: any
  playerAction: any
  setActiveLoading: any
  activeLoading: any

  playerHand: any
  setPlayerHand: any
  user: any
}

const Card: FC<CardProps> = ({ card, setCardToPlay, playerAction, setActiveLoading, setCardId, playerHand, setPlayerHand, user, activeLoading }) => {

  const cardSelect = (card: CardType) =>{

    console.log("CARD CLICKED: ", card)
    setCardId(card.id)

    setCardToPlay([card.name, card.damage, card.armor, card.description, card.id, card.duration])


    setActiveLoading(true)

    // console.log("PLAYER HAND", playerHand)

    // setPlayerHand(playerHand.filter((handCard: { card_id: number; })=> handCard.card_id !== card.id))
   

  }

  return (
    <div id='card' className='flex h-48 w-36' >

    {playerAction === 'LOAD' && !activeLoading?

    <div
    onClick={()=>cardSelect(card)}

    className="bg-white border-8 border-yellow-300 rounded-lg shadow-md flex flex-col items-center justify-between w-full hover:scale-110"
    >

      <h2 className="text-md text-black font-bold mb-2 text-center">{card.name}</h2>

      <div className="text-center text-sm">
        <div>`IMAGE`</div>
        <p className="text-black mb-1 text-sm">
          <strong>Attack:</strong> {card.damage}
        </p>
        <p className="text-black mb-1 text-sm">
          <strong>Defense:</strong> {card.armor}
        </p>
        <p className="text-black mb-1 text-sm">
  <strong>Duration:</strong> {card.duration ? card.duration : 0}
</p>
      </div>
      <p className="text-black text-sm text-center">{card.description}</p>
    </div>

    :

    <div
    className="cursor-not-allowed bg-white border rounded-lg shadow-md flex flex-col items-center justify-between w-full">

      <h2 className="text-md text-black font-bold mb-2 text-center">{card.name}</h2>

      <div className="text-center">
        <div>`IMAGE`</div>
        <p className="text-black mb-1 text-sm">
          <strong>Attack:</strong> {card.damage}
        </p>
        <p className="text-black mb-1 text-sm">
          <strong>Defense:</strong> {card.armor}
        </p>
        <p className="text-black mb-1 text-sm">
  <strong>Duration:</strong> {card.duration ? card.duration : 0}
</p>
      </div>
      <p className="text-black text-sm text-center">{card.description}</p>
    </div>
    }

    </div>

  );
}
export default Card;
