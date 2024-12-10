import React, { FC } from 'react';

type InstructionProps = {
  user: Object | null;
};

const Instructions: FC<InstructionProps> = ({user }) => {

  return (
    <div
      className="h-screen bg-radial-custom dark:text-slate-200 text-white sm:grid-cols-1 md:grid-cols-2"
      aria-label="Instructions Page"
    >
      <div
        className="justify-start flex-cols space-between"
        aria-labelledby="instructions-heading"
      >
        <h2
          id="instructions-heading"
          className="pt-20 font-extrabold text-4xl text-center"
          aria-label="Instructions Heading"
        >
          INSTRUCTIONS
        </h2>
        <div className="border-white p-3 text-center" aria-label="Instructions Basics Section">
          BASICS
          <br></br>
          <p className='text-white text-start'>
            Event Horizon is a turned-base game, where players can control the outcome of their game with a combination of grand strategy and tactical decision-making. Although cards are at 
            the centerpoint of gameplay, there's much more to consider than what card you are going to play! Every player has three actions that they may choose from in the game.
          </p>
          <br></br>
          {
          // Comment here: the idea is that down the line we would actually have these buttons shown on our page as they appear on the game board 
          }
          <p className='text-white text-start'>
            SHIELD: One of the most basic actions, it is always available to a player! Whenever you activate your shield for a turn, it will block 50% of all incoming damage. Even if you are
            outgunned, there is always a way to turn the tides of battle!
          </p>
          <br></br>
          <p className='text-white text-start'>
            LOAD: This action enables a player to load a card for use. 
            If the card is defensive, and provides buffs to their armor, then this card will take effect on the following round. It does not take effect immediately, so ensure that you
            are increasing your defense at a good time!
            If the card increases your damage output or activates an effect, then it will begin doing that damage when you fire! If you previously loaded a damage card and want to change what is being
            fired, simply load a new card and this card will be returned to your hand!
          </p>
          <br></br>
          <p className='text-white text-start'>
            FIRE: This action enables a player to activate a "loaded" card so that it can do damage! If you previously loaded a card that enhances damage, it will be fired when you do this!
            If no card is loaded, then you perform a basic attack that does 5 damage.
          </p>
        </div>
        <div className="border-white p-3 text-center" aria-label="Instructions Rounds Section">
          ROUNDS
          <br></br>
          {
          // Comment here: down the line we would show some of the visual cues that reflect changes on a round
          // we just want the end-user to be aware of what kind of effects will occur
          }
          <p className='text-white text-start'>
            Event Horizon is a turn-based game, and on every round you are allowed to take one action...the same goes for your opponent! Keep this in mind whenever you are deciding to make a play.
            There are visual cues that will inform you what happened on the previous round; for example, below you will see that when an opponent loads a card the ENEMY STATUS changes to red and 
            informs you that they are armed.
          </p>
          <br></br>
          <p className='text-white text-start'>
            However, you might also notice that you will not be informed of what card your enemy has loaded on that round! This is an intended feature. If you can, infer what your enemy might attempt 
            to do on the next turn...but beware that being overly defensive might set you behind!
          </p>
        </div>
        <div className="border-white p-3" aria-label="Instructions Goal Section">
          GOAL
        </div>
      </div>
    </div>
  );
};

export default Instructions;