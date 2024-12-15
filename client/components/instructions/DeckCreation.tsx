import React, { FC, useEffect, useState } from 'react';
import axios from 'axios';

interface card {
  id: number,
  name: string,
  description: string,
  damage: number,
  armor: number,
  duration: number
}

const DeckCreation = () => {

  const [cards, setCards] = useState([])

  useEffect(() => {
    axios.get('/cards')
      .then((response) => {
        setCards(response.data.slice(0, 10))
      })
      .catch((error) => {
        console.error(`Error on fetching cards for instructions page.`)
      })
  })

  return (
    <div id='deckCreation' style={{ width: "80%"}}>

      <div className='text-center justify-items-center items-center self-center pb-4'>
        <span>
          <h2 className='text-2xl'>What are cards, and what is a card deck?</h2>
        </span>
      </div>

      <span>
        <p>
          In Event Horizon, cards are the primary means by which you develop and execute your strategy. As you
          continue playing Event Horizon, you will accrue a score and unlock new cards These cards can
          be used to build a deck, which is a predefined set of cards that you wish to take into a game. Here are some of
          the cards that are currently available!
        </p>
      </span>

      <div id='deckCreation-cards' className='self-center justify-self-center grid grid-cols-5 justify-center gap-3 items-center justify-items-center pt-10 pb-4' style={{width: '75%', minWidth: '75%'}}>
          { 
            cards.map((card: card) => (
              <div
                key={card.id}
                className={`shadow-black relative bg-white border border-slate-300 hover:scale-110 hover:z-20 mx-1 first:ml-0 my-1 rounded-lg shadow-lg flex-col justify-items-center text-black text-center flex-shrink-0 z-10 h-48 w-32'`}
                style={{ flex: '0 0 25%', minWidth: "32px", aspectRatio: "3/4" }}
              >
                {/* Card Content */}
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
                <p className="text-black text-xs text-center">{card.description}</p>
                </div>
            ))
          }
      </div>
      
      <div className='pb-8 pt-8'>
          <hr></hr>
      </div>

      <span>
        <h2 className='text-center text-2xl'>Where can I create a deck?</h2>
        <p className='pt-4 pb-4'> 
          You may create a deck under your Profile page, in the Cards section.
          This section also enables you to view any cards that you have earned thus far
          from playing Event Horizon.
        </p>
      </span>
      
      <span>
        <h2 className='text-center text-2xl'>How should I decide what to include in a deck?</h2>
        <p className='pt-4 pb-4'>
          The chosen cards in your deck should align with your strategy; consider how the cards
          fit into your plan to win a game! There are inherent trade-offs if your deck does not 
          balance its offensive and defensive capabilities. However, this all depends on your
          strategy for success!
        </p> 
      </span>
      
      <span>
        <h2 className='text-center text-2xl'>What else should I consider when creating a deck?</h2>
        <p className='pt-4 pb-4'>
          Whenever you are creating a deck, the items that you select are restricted based on a
          points value. Whenever you select a card, you can see how many "points" it requires in
          order to be included in your deck. Although a card might offer a substantial amount of 
          damage, it means that you will have fewer cards to use throughout a game... and there is
          also the possibility that the enemy strategy mitigates this damage!
        </p>
      </span>
      
    </div>
  )

}

export default DeckCreation;