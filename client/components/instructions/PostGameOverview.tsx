import React, { FC, useEffect, useState } from 'react';

const PostGameOverview = () => {

  return (
    <div id='PostGameOverview' className='' style={{ width: "80%"}}>
      
      <h2 className='text-center text-2xl'>What happens when a game ends?</h2>
      <div className='self-center justify-self-center' style={{width: '60%', minWidth:'60%'}}>
        <p className='pt-4 pb-4'> 
          Whenever a game is over, you are awarded a score based on how many rounds
          you played with your opponent. This takes into account whether you have won
          or lost the game; regardless you will be afforded a score for your efforts.
          As you accrue score within Event Horizon, your arsenal expands and new cards
          are unlocked as you play!
        </p>
      </div>

      <h2 className='text-center text-2xl'>How does scoring work?</h2>
      <div className='self-center justify-self-center' style={{width: '60%', minWidth:'60%'}}>
        <ul className='pt-4' style={{listStyleType: 'circle'}}>
          <li className='pt-2 pb-2'>If you won the game naturally, you earn 10 points for every round played</li>
          <li className='pt-2 pb-2'>If you lost the game naturally, you earn 6 points for every round played</li>
          <li className='pt-2 pb-2'>If you won by forfeit, you earn 8 points for every round played</li>
          <li className='pt-2 pb-4'>If you forfeit, you earn 4 points for every round played</li>
        </ul>
      </div>
    </div>
  )

}

export default PostGameOverview;