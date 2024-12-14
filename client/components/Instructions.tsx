import React, { FC, useEffect, useState } from 'react';
import Matchmaking from './instructions/Matchmaking';
import DeckCreation from './instructions/DeckCreation';
import GameplayOverview from './instructions/GameplayOverview';
import BasicMechanics from './instructions/BasicMechanics';
import PostGameOverview from './instructions/PostGameOverview';

type InstructionProps = {
  user: Object | null;
};

const Instructions: FC<InstructionProps> = ({user }) => {

  const tabs = [
    {id: "tab1", label: "Matchmaking"},       // this tab talks about how to get into a match, segways into Deck Creation
    {id: "tab2", label: "Deck Creation"},     // this tab talks about how to create a deck && points considerations
    {id: "tab3", label: "Gameplay Overview"}, // this tab talks about health, armor, your hand, and how Rounds work
    {id: "tab4", label: "Basic Mechanics"},   // this tab talks about the BLOCK, LOAD, && FIRE buttons
    {id: "tab5", label: "Post-Game Overview"} // this section talks about what happens when a game ends (score update, cards update)
  ]

  const tab_content = {
    "tab1": (<Matchmaking/>),
    "tab2": (<DeckCreation/>),
    "tab3": (<GameplayOverview/>),
    "tab4": (<BasicMechanics/>),
    "tab5": (<PostGameOverview/>),
  }

  const [currentTab, setCurrentTab] = useState(tabs[0].id)

  return (
    <div id='main' className='pt-20 justify-center items-center justify-items-center bg-starfield-light dark:bg-starfield'>

      {/* This section only handles the "Tabs" view and selection */}
      <div id='tabs-selection' className='text-white'>
        {
          tabs.map((tab) => (
            <button key={tab.id} className={`pl-3 pr-3 ${currentTab === tab.id ? 'animate-pulse bg-yellow-300 text-black' : 'text-white'}`} onClick={() => setCurrentTab(tab.id)}>
              {tab.label}
            </button>
          ))
        }
      </div>

      {/* This dynamically renders content based on the "Tab" selected in the DIV above */}
      <div id='tab-content' className='pt-16 justify-center items-center justify-items-center' style={{width: "80%"}}>
        {tab_content[currentTab]}
      </div>

    </div>
  );
};

export default Instructions;