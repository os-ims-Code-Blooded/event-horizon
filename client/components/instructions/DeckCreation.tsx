import React, { FC, useEffect, useState } from 'react';

const DeckCreation = () => {

  return (
    <div id='deckCreation' style={{ width: "80%"}}>

      <span>
        <h2>Where can I create a deck?</h2>
        <p> 
          You may create a deck under your Profile page, in the Cards section.
          This section also enables you to view any cards that you have earned thus far
          from playing Event Horizon.
        </p>
      </span>
      
      <span>
        <h2>How should I decide what to include in a deck?</h2>
        <p>
          The chosen cards in your deck should align with your strategy; consider how the cards
          fit into your plan to win a game! There are inherent trade-offs if your deck does not 
          balance its offensive and defensive capabilities. However, this all depends on your
          strategy for success!
        </p> 
      </span>
      
      <span>
        <h2>What else should I consider when creating a deck?</h2>
        <p>
          Whenever you are creating a deck, the items that you select are restricted based on a
          points value. Whenever you select a card, you can see how many "points" it requires in
          order to be included in your deck. Although a card might offer a substantial amount of 
          damage, it means that you will have less cards to use throughout a game...and there is
          also the possibility that the enemy strategy mitigates this damage!
        </p>
      </span>
      
    </div>
  )

}

export default DeckCreation;