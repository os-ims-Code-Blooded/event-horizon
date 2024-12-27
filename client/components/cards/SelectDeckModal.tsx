import React, {useEffect, useState} from "react";
import axios from 'axios';
import heavyclick from '../../sfx/heavyclick.wav'
import useSound from 'use-sound';

/* Example inclusion:

      <div id='test'>
        { showModal ?
          <div className='modal fixed inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 z-40 modal-middle'>
            <SelectDeck user={user} volume={volume} toggleModal={toggleModal} callback={() => {console.log('Callback executed!')}}/>
          </div>
          :
          <></>
        }
      </div>
      
*/

const SelectDeck = ({user, volume, toggleModal, callback, callbackParams}) => {

  const [userDecks, setUserDecks] = useState<any[]>([]);          // used to render all decks in the select dropdown
  const [deckSelected, setDeckSelected] = useState(false);        // used to disable/enable the Accept button and exit model
  const [cancelled, setCancelled] = useState(false);

  const [playHeavyClickSFX] = useSound(heavyclick, volume);

  // used to select a deck and enable the accept button
  const patchDeck = (e: any) => {
    let sendSelectedDeck;
    
    if (userDecks[e.target.value]){
      sendSelectedDeck = {
        selectedDeck: {
          connect: {
            id: Number(userDecks[e.target.value].id)
            }
          }
      }
      
      axios.patch(`/profile/${user.id}`, sendSelectedDeck)
        .then((response) => {
          setDeckSelected(true);
        })
        .catch((error) => {
          console.error(`Error selecting deck within SelectDeckModal.`)
        })
    } else {
      setDeckSelected(false);
    }
  }

  const execute = async () => {

    try {
      if (cancelled) {
        toggleModal(false);
        console.log(`Cancelled`)
      } else if (deckSelected) {
        await callback(callbackParams);
        toggleModal(false);
      }
    } catch (error) {
      console.error(`Error within select deck modal.`)
    }
  }

  // on modal render, get the user's card decks
  useEffect( () => {
    axios.get(`/profile/decks/${user.id}`)
      .then((response) => {
        setUserDecks(response.data)
      })
      .catch((err) => {
        console.error(err)
      })
  }, [])

  return (      
    <div className='fixed h-48 w-48 bg-slate-700 text-text dark:text-darkText rounded-lg shadow justify-center justify-items-center self-center'>
      
      <div className="flex self-end justify-end justify-items-end text-end w-full pr-2 pt-2">
        <button 
          className='hover:scale-130 hover:bg-slate-400 hover:rounded-full'
          onClick={ () => {
            setCancelled(true);
            toggleModal(false);
          } }>
        ❌
        </button>
      </div>

      {/* This section is the select drop-down, when an item is selected a patch request is sent and the Accept button becomes clickable */}
      <div className='pt-8 z-10 relative pb-16'>
        <select className='text-text dark:text-darkText bg-slate-300 dark:bg-slate-500 w-70 z-10 relative rounded-md' id="deckSelect" onChange={(e)=>{
          patchDeck(e)}}>
          <option className='text-text dark:text-darkText bg-slate-300 dark:bg-slate-500 z-10 relative' value="">--Select deck--</option>
          {userDecks.map((deck, index)=>{
            return(
              <option className='z-10 relative' key={`${deck.deck_name}-${deck.id}`} value={index}>{deck.deck_name}</option>
            )
          })}
        </select>
      </div>


      {/* If the user has selected a deck, we allow for the callback to execute */}
      { deckSelected ?
        (
          <button className='bg-darkGreen hover:bg-success dark:hover:text-text dark:hover:bg-success text-text dark:text-darkText rounded-lg w-20 h-8' onClick={
            ()=> {
              playHeavyClickSFX();
              execute();
            }
          }>
          Accept
          </button>
        ) : (
          <button className='bg-slate-500 pb-2 cursor-not-allowed rounded-lg w-20 h-8' disabled={deckSelected === false}>
          Accept
          </button>
        )
      }
    </div>
  );
}

export default SelectDeck;