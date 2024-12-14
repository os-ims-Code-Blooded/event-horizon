import React, { FC, useEffect, useState } from 'react';

const Matchmaking = () => {

  return (
    <div id='matchmaking' className='' style={{ width: "80%"}}>
      <h2 className='text-center text-2xl text-text dark:text-darkText'>Before You Search For A Game</h2>
      <ol className='pt-4' style={{listStyleType: "decimal", color: 'white'}}>
        <li className='text-text dark:text-darkText'>Create a card deck in order to search for a game</li>
        <li className='text-text dark:text-darkText'>Once your deck has been created, navigate to Play</li>
        <li className='text-text dark:text-darkText'>Select your card deck from the dropdown and begin searching</li>
        <li className='text-text dark:text-darkText'>The page should display "Waiting for Game", once a player is found the game will begin!</li>
      </ol>

      <h2 className='pt-6 text-center text-2xl text-text dark:text-darkText'>Things To Be Aware Of</h2>
      <ul className='pt-4' style={{listStyleType: 'circle', color: 'white'}}>
        <li className='text-text dark:text-darkText'>It may take some time to find a game, players might already be playing a game</li>
        <li className='text-text dark:text-darkText'>You may navigate away from the page and return at any time</li>
        <li className='text-text dark:text-darkText'>If you want to stop searching, you can click to cancel your search</li>
      </ul>
    </div>
  )

}

export default Matchmaking;