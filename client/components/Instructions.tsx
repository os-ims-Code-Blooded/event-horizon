import React, { FC, useEffect, useState } from 'react';
import { GiRosaShield } from "react-icons/gi";
import { GiMachineGunMagazine } from "react-icons/gi";
import { GiRocket } from "react-icons/gi";
import axios from "axios";

type InstructionProps = {
  user: Object | null;
};

const Instructions: FC<InstructionProps> = ({user }) => {

  const [localCards, setLocalCards] = useState(null);

  useEffect(() => {

    axios.get('/cards')
      .then((response) => {
        setLocalCards(response.data.slice(0, 11)); // gets 10 cards from the server response
      })
      .catch((error) => {
        console.error(`Error fetching cards from main database for instructions display.`)
      })

  })

  return (
    <div className='h-full sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-items-center'>
      <div className='bg-starfield-light dark:bg-starfield absolute inset-0 z-9'></div>
      <div
      className="h-full bg-radial-custom dark:bg-radial-dark dark:text-slate-200 text-white justify-items-center z-10 relative "
      aria-label="Instructions Page"
      style={{width: '60%'}}
    >
      {/* Main DIV container for all items */}
      <div
        className="justify-start flex-cols space-between z-10 relative"
        aria-labelledby="instructions-heading"
      >
        <h2
          id="instructions-heading"
          className="pt-20 font-extrabold text-4xl text-text dark:text-darkText text-center z-10 relative"
          aria-label="Instructions Heading"
        >
          INSTRUCTIONS
        </h2>
        
        <div></div>

        {/* Basics Section with Buttons */}
        <div className="border-text dark:border-darkText text-text dark:text-darkText p-3 text-center z-10 relative" aria-label="Instructions Basics Section">
          BASICS
          <br></br>
          <p className='text-text dark:text-darkText text-start z-10 relative'>
            Event Horizon is a turned-base game, where players can control the outcome of their game with a combination of grand strategy and tactical decision-making. Although cards are at 
            the centerpoint of gameplay, there's much more to consider than what card you are going to play! Every player has three actions that they may choose from in the game.
          </p>
          <br></br>
          {/* The BLOCK button */}
          <div className='h-auto flex flex-col items-center'>
            <button
              value='BLOCK'
              className='w-20 h-20 aspect-square bg-blue-600 hover:bg-blue-900 border-slate-600 border-2 text-text dark:text-darkText font-bold text-xs sm:text-sm md:text-base lg:text-lg rounded-full flex justify-center items-center justify-items-center overflow-hidden text-ellipsis focus:ring-4 focus:ring-blue-600'
            >
              <GiRosaShield style={{fontSize: 50, pointerEvents: "none"}} />
            </button>
            <p className='text-text dark:text-darkText text-start z-10 relative'>
              One of the most basic actions, it is always available to a player! Whenever you activate your shield for a turn, it will block 50% of all incoming damage. Even if you are
              outgunned, there is always a way to turn the tides of battle!
            </p>
          </div>
          {/* The LOAD button */}
          <div className='h-auto flex flex-col items-center'>
            <button
              value='LOAD'
              className='w-20 h-20 aspect-square bg-yellow-300 hover:bg-yellow-600 border-slate-600 border-2 text-text dark:text-darkText font-bold text-xs sm:text-sm md:text-base lg:text-lg rounded-full justify-center items-center justify-items-center overflow-hidden text-ellipsis focus:ring-4 focus:ring-yellow-300'
            >
              <GiMachineGunMagazine style={{fontSize: 50, pointerEvents: "none"}} />
            </button>
            <p className='text-text dark:text-darkText text-start z-10 relative'>
              This action enables a player to load a card for use. 
              If the card is defensive, and provides buffs to their armor, then this card will take effect on the following round. It does not take effect immediately, so ensure that you
              are increasing your defense at a good time!
              If the card increases your damage output or activates an effect, then it will begin doing that damage when you fire! If you previously loaded a damage card and want to change what is being
              fired, simply load a new card and this card will be returned to your hand!
            </p>
          </div>
          {/* The FIRE button */}
          <div className='h-auto flex flex-col items-center'>
            <button
              value='FIRE'
              className='w-20 h-20 aspect-square bg-red-600 hover:bg-red-900 text-text dark:text-darkText border-slate-600 border-2 font-bold text-xs sm:text-sm md:text-base lg:text-lg rounded-full justify-center justify-items-center items-center overflow-hidden text-ellipsis focus:ring-4 focus:ring-red-600'
            >
              <GiRocket style={{fontSize: 50, transform: "rotate(270deg)", pointerEvents: "none"}}/>
            </button>
            <p className='text-text dark:text-darkText text-start z-10 relative'>
              This action enables a player to activate a "loaded" card so that it can do damage! If you previously loaded a card that enhances damage, it will be fired when you do this!
              If no card is loaded, then you perform a basic attack that does 5 damage.
            </p>
          </div>
        </div>

        <div className="border-text dark:border-darkText p-3 text-center text-text dark:text-darkText z-10 relative" aria-label="Instructions Rounds Section">
          ROUNDS
          <br></br>
          {
          // Comment here: down the line we would show some of the visual cues that reflect changes on a round
          // we just want the end-user to be aware of what kind of effects will occur
          }
          <p className='text-text dark:text-darkText text-start z-10 relative'>
            Event Horizon is a turn-based game, and on every round you are allowed to take one action...the same goes for your opponent! Keep this in mind whenever you are deciding to make a play.
            There are visual cues that will inform you what happened on the previous round; for example, below you will see that when an opponent loads a card the ENEMY STATUS changes to red and 
            informs you that they are armed.
          </p>
          <br></br>
          <p className='text-text dark:text-darkText text-start z-10 relative'>
            However, you might also notice that you will not be informed of what card your enemy has loaded on that round! This is an intended feature. If you can, infer what your enemy might attempt 
            to do on the next turn...but beware that being overly defensive might set you behind!
          </p>
        </div>
        <div className="border-text dark:border-darkText text-text dark:text-darkText text-center p-3 z-10 relative" aria-label="Instructions Goal Section">
          GOAL
        </div>
      </div>
    </div>
    </div>
  );
};

export default Instructions;