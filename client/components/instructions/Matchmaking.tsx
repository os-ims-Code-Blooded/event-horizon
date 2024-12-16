import React, { FC, useEffect, useState } from 'react';

const Matchmaking = () => {

  return (
    <div id='matchmaking' className='' style={{ width: "80%", display: "flex", flexDirection: "column",
      justifyContent: "center", justifyItems: "center", alignItems: "center", padding: "16px"}}>
      <h2 className='text-center text-2xl text-text dark:text-darkText'>Before You Search For A Game</h2>
      <div className='self-center justify-self-center' style={{width: '60%', minWidth:'60%'}}>
        <ol className='pt-4' style={{listStyleType: "decimal"}}>
          <li className='pt-2 pb-2'>Create a card deck in order to search for a game.</li>
          <li className='pt-2 pb-2'>Once your deck has been created, navigate to Play!</li>
          <li className='pt-2 pb-2'>Select your card deck from the dropdown and begin searching...</li>
          <li className='pt-2 pb-2'>The page should display "Waiting for Game", once a player is found the game will begin and you will be able to begin playing!</li>
        </ol>
      </div>

      <h2 className='pt-6 text-center text-2xl text-text dark:text-darkText'>Things To Be Aware Of</h2>
      <div className='self-center justify-self-center' style={{width: '60%', minWidth:'60%'}}>
        <ul className='pt-4' style={{listStyleType: 'circle'}}>
          <li className='pt-2 pb-2'>It may take some time to find a game, players might already be in a game...</li>
          <li className='pt-2 pb-2'>If you want to stop searching, you can click to cancel your search!</li>
          <li className='pt-2 pb-2'>If you are in a game, but want to exit, click the Self-Destruct button!</li>
          <li className='pt-2 pb-4'>You may navigate away from the page and return at any time! However, please be considerate of your opponent's time, if you leave a round open for longer than five (5) minutes then your opponent wins by default.</li>
        </ul>
      </div>

    </div>
  )

}

export default Matchmaking;