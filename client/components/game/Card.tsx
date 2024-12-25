import React, { FC, useState } from 'react';

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
  turnEnded: any
  playCardSFX: any
  cardToPlay: any
  setIsClicked: any;
  isClicked: any;
}

const Card: FC<CardProps> = ({ isClicked, card, setIsClicked, setCardToPlay, cardToPlay, playerAction, setActiveLoading, setCardId, playerHand, setPlayerHand, user, activeLoading, turnEnded, playCardSFX }) => {
  const cardSelect = (card: CardType) =>{

    playCardSFX()
    // console.log("CARD CLICKED: ", card)
    setCardId(card.id)
    setCardToPlay([card.name, card.damage, card.armor, card.description, card.id, card.duration])
    setActiveLoading(true)
    // console.log("PLAYER HAND", playerHand)
    // setPlayerHand(playerHand.filter((handCard: { card_id: number; })=> handCard.card_id !== card.id))
  }

  return (
    <div id='card' className='flex flex-wrap shrink justify-center justify-items-center items-center gap-4' >

    {playerAction === 'LOAD' && !turnEnded?
      <div
        onClick={()=>{
          cardSelect(card);
          setIsClicked(card.id);
        }}
        className={`bg-white border-8 ${isClicked === card.id && activeLoading ? 'border-success z-20 scale-110' : 'border-yellow-300' } rounded-lg flex-shrink-0 h-[calc(100vw/3)] w-[calc(100vw/4)] aspect-[3/4] md:max-h-[12rem] md:max-w-[9rem] sm:max-h-[8rem] sm:max-w-[8rem] 
                xs:max-h-[6rem] xs:max-w-[4.5rem] shadow-md flex flex-col items-center justify-between hover:z-20 hover:scale-110`}
      >
        <h2 className="text-md sm:text-sm xs:text-sm text-black font-bold mb-2 text-center">{card.name}</h2>
        <div className="text-center text-sm">
          <div className='text-sm'>`IMAGE`</div>
          <p className="text-black mb-1 sm:text-xs text-sm xs:text-xs">
            <strong>Attack:</strong> {card.damage}
          </p>
          <p className="text-black mb-1 sm:text-xs text-sm xs:text-xs">
            <strong>Defense:</strong> {card.armor}
          </p>
          <p className="text-black mb-1 sm:text-xs text-sm xs:text-xs"> 
            <strong>Duration:</strong> {card.damage? card.duration + 1 : null} {card.armor? card.duration : null}
          </p>
        </div>
        <p className="text-black text-sm sm:text-xs xs:text-xs text-center text-wrap">{card.description}</p>
      </div>
      :
      <div
      className="cursor-not-allowed bg-white border rounded-lg shadow-md flex-col items-center flex flex-shrink-0 h-[calc(100vw/3)] w-[calc(100vw/4)] aspect-[3/4] md:max-h-[12rem] md:max-w-[9rem] sm:max-h-[8rem] sm:max-w-[8rem] 
                xs:max-h-[6rem] xs:max-w-[4.5rem] justify-between hover:z-20 hover:scale-110 ">
        <h2 className="text-md text-black font-bold mb-2 text-center">{card.name}</h2>
        <div className="text-center">
          <div>`IMAGE`</div>
          <p className="text-black mb-1 sm:text-xs text-sm">
            <strong>Attack:</strong> {card.damage}
          </p>
          <p className="text-black mb-1 sm:text-xs text-sm">
            <strong>Defense:</strong> {card.armor}
          </p>
          <p className="text-black mb-1 sm:text-xs text-sm">
            <strong>Duration:</strong> {card.damage? card.duration + 1 : null} {card.armor? card.duration : null}
          </p>
        </div>
        <p className="text-black text-sm sm:text-xs text-center">{card.description}</p>
      </div>
    }
    </div>
  );
}
export default Card;

// className={`bg-white border-8 ${cardToPlay[0].card.id === card.id ? 'border-success' : 'border-yellow-300'} rounded-lg shadow-md flex flex-col items-center justify-between w-full hover:scale-110`}
