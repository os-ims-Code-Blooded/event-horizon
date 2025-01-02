import React, { FC, useState } from 'react';
import renderCardImage from '../cards/CardImageRenderer.tsx';

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
  volume: any;
}

const Card: FC<CardProps> = ({ isClicked, card, volume, setIsClicked, setCardToPlay, cardToPlay, playerAction, setActiveLoading, setCardId, playerHand, setPlayerHand, user, activeLoading, turnEnded, playCardSFX }) => {
  const cardSelect = (card: CardType) =>{

    playCardSFX()
    setCardId(card.id)
    setCardToPlay([card.name, card.damage, card.armor, card.description, card.id, card.duration])
    setActiveLoading(true)
  }

  return (
    <div id='card' className='flex flex-wrap shrink justify-center justify-items-center items-start gap-4' >

    {playerAction === 'LOAD' && !turnEnded?
      <div
        onClick={()=>{
          cardSelect(card);
          setIsClicked(card.id);
        }}
        className={`bg-white border-8 ${isClicked === card.id && activeLoading ? 'border-success z-20 scale-110' : 'border-yellow-300' } rounded-lg flex-shrink-0  w-[calc(100vw/4)] aspect-[3/4] md:max-h-[12rem] md:max-w-[9rem] sm:max-h-[8rem] sm:max-w-[6rem] 
                xs:max-h-[6rem] xs:max-w-[4.5rem] shadow-md flex flex-col items-center justify-between hover:z-20 hover:scale-110 h-full`}
      >
        <h2 className="text-xs sm:text-xs xs:text-xs text-black font-bold mb-2 text-center">{card.name}</h2>
        <div className='justify-center justify-items-center align-middle items-center content-center w-full h-full fit'>
          {renderCardImage(card)}
        </div>
        <div className="text-center text-xs flex-shrink">
          <p className="text-black mb-1 sm:text-xs text-xs xs:text-xs">
            { card.damage ? (<><strong>Attack:</strong> {card.damage}</>): (<><strong>Defense:</strong> {card.armor}</>) }
          </p>
          <p className="text-black mb-1 sm:text-xs text-xs xs:text-xs">
            <strong>Duration:</strong> {card.damage ? card.duration + 1 : null} {card.armor? card.duration : null}
          </p>
        </div>
      </div>
      :
      <div
      className="cursor-not-allowed bg-white border rounded-lg shadow-md flex-col items-center flex flex-shrink-0  w-[calc(100vw/4)] aspect-[3/4] md:max-h-[12rem] md:max-w-[9rem] sm:max-h-[8rem] sm:max-w-[6rem] 
                xs:max-h-[6rem] xs:max-w-[4.5rem] justify-between hover:z-20 hover:scale-110 h-full">
        <h2 className="text-xs text-black font-bold mb-2 text-center">{card.name}</h2>
        <div className='justify-center justify-items-center align-middle items-center content-center w-full h-full'>
          {renderCardImage(card)}
        </div>
        <div className="text-center text-xs flex-shrink">
          <p className="text-black mb-1 sm:text-xs text-xs xs:text-xs">
            { card.damage ? (<><strong>Attack:</strong> {card.damage}</>): (<><strong>Defense:</strong> {card.armor}</>) }
          </p>
          <p className="text-black mb-1 sm:text-xs text-xs xs:text-xs">
            <strong>Duration:</strong> {card.damage ? card.duration + 1 : null} {card.armor? card.duration : null}
          </p>
        </div>
      </div>
    }
    </div>
  );
}
export default Card;

// className={`bg-white border-8 ${cardToPlay[0].card.id === card.id ? 'border-success' : 'border-yellow-300'} rounded-lg shadow-md flex flex-col items-center justify-between w-full hover:scale-110`}
