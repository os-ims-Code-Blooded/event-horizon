import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import { toast, ToastContainer } from 'react-toastify';
import Card from '../game/Card.tsx';

type Deck = {
  id: number;
  deck_name: string;
};

type Card = {
  duration: any;
  card_id: any;
  damage: number;
  armor: number;
  image_url: string;
  description: string;
  id: number;
  name: string;
};

const CardsPage = ({ user }: { user: { id: number } }) => {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [selectedDeck, setSelectedDeck] = useState<Deck | null>(null);
  const [cards, setCards] = useState<Card[]>([]);
  const [allCards, setAllCards] = useState<Card[]>([]);
  const [allSelectedCards, setAllSelectedCards] = useState<number[]>([]);
  const [selectedCardsInDeck, setSelectedCardsInDeck] = useState<number[]>([]);
  const [newDeckName, setNewDeckName] = useState<string>("");
  const [showNewDeckModal, setShowNewDeckModal] = useState(false);
  const [deckPoints, setDeckPoints] = useState(0)
  const [currDeckVal, setCurrDeckVal] = useState(0)



  const fetchDecks = async () => {
    try {
      const response = await axios.get(`/profile/decks/${user.id}`);
      setDecks(response.data);
    } catch (error) {
      toast.error("Error fetching decks:", error);
    }
  };

  const fetchDeckCards = async (deckSelected) => {
    try {
      const response = await axios.get(`/profile/decks/specific/${deckSelected.id}`);
      setCards(response.data);
      setSelectedDeck(deckSelected);
    } catch (error) {
      toast.error("Error fetching deck cards:", error);
    }
  };


  ////////////////////////////////////////////////////////////////////////
  // toggling for cards displayed in allCards to add to a deck

  const toggleCardSelection = (cardId: number) => {
    setAllSelectedCards((prevSelected) =>
      prevSelected.includes(cardId)
        ? prevSelected.filter((id) => id !== cardId)
        : [...prevSelected, cardId]
    );


    // console.log("CARD ID", cardId)
    // console.log("cards", allCards)
    let currCard = allCards.filter(card=> card.id === cardId)

    // console.log("current card", currCard)
    // console.log("SELECTED CARDS", allSelectedCards)
    !allSelectedCards.includes(cardId) ? 
    
    setDeckPoints(deckPoints + ((currCard[0].armor + currCard[0].damage) * (currCard[0].duration + 1)))
    
    :
    
    setDeckPoints(deckPoints - ((currCard[0].armor + currCard[0].damage) * (currCard[0].duration + 1)))

    
  };
  ////////////////////////////////////////////////////////////////////////////////

  // toggling for selecting cards in deck to remove
  const toggleDeckCardSelection = (cardId: number) => {
    setSelectedCardsInDeck((prevSelected) =>
      prevSelected.includes(cardId)
        ? prevSelected.filter((id) => id !== cardId)
        : [...prevSelected, cardId]
    );
  };





  ////////////////// ADDS CARDS ////////////////////////////////////////////////////////////////

  const addCardsToDeck = async () => {
    if (!selectedDeck || allSelectedCards.length === 0) {
      toast.error("Please select a deck and at least one card.");
      return;
    }

    try {
      const payload = {
        data: {
          deck_id: selectedDeck.id,
          add_cards: [allSelectedCards],
        },
      };

      await axios.patch(`/profile/decks/${user.id}`, payload);

      fetchDeckCards(selectedDeck);
      toast.success("Cards added to deck successfully!");
      fetchDecks();
      setAllSelectedCards([]);

    } catch (error) {
      toast.error("Error adding cards to deck:", error);
    }
  };


///////////////////////////////////////////////////////////////////////////////////////



/////////////// remove cards //////////////////////////////////////////////
  const removeCardsFromDeck = async () => {
    if (!selectedDeck || selectedCardsInDeck.length === 0) {
      toast.error("Please select a deck and at least one card.");
      return;
    }

    const confirmRemoval = window.confirm("Are you sure you want to remove the selected cards from the deck?");
    if (!confirmRemoval) return;

    try {
      console.log('ALL CARDS', cards);
      const actualCardIds = cards
      .filter((card) => selectedCardsInDeck.includes(card.id))
      .map((card) => card.card_id);

      const payload = {
        data: {
          deck_id: selectedDeck.id,
          delete_cards: actualCardIds,
        },
      };
      setCards((prevCards) =>
        prevCards.filter((card) => !selectedCardsInDeck.includes(card.id))
      );
      await axios.patch(`/profile/decks/${user.id}`, payload);

      toast.success("Cards removed from deck successfully!");
      setSelectedCardsInDeck([]);
      fetchDeckCards(selectedDeck);
      fetchDecks();
    } catch (error) {
      toast.error("Error removing cards from deck:", error);
    }
  };


  ////////////////////////// CREATE DECK ////////////////////////////


  const createNewDeck = async () => {
    console.log("ALL SELECTED CARDS", allSelectedCards)
    setDeckPoints(0)
    
    if (!newDeckName.trim() || allSelectedCards.length === 0) {
      toast.error("Please provide a deck name and select at least one card.");
      return;
    }
    
    
    try {

      // console.log("TRY BLOCK - ALL SELECTED CARDS", [allSelectedCards, 5].flat())
      // let allCardsPlusPhaser = [allSelectedCards, 5].flat()
      // setAllSelectedCards(allCardsPlusPhaser)

      await axios.post(`/profile/decks/${user.id}`, {
        data: {
          deck_name: newDeckName.trim(),
          cards: allSelectedCards
        }
      });

      toast.success("Deck created successfully!");

      const getDecks = await axios.get(`/profile/decks/${user.id}`);

      const newDeck = getDecks.data.reduce((accum, curr) => {
        if (curr.deck_name === newDeckName){
          return curr;
        } else {
          return accum;
        }
      }, null);

      setNewDeckName("");
      setAllSelectedCards([]);
      fetchDeckCards(newDeck);
      setSelectedDeck(newDeck);
      fetchDecks();
      setShowNewDeckModal(false);
    } catch (error) {
      toast.error("Error creating new deck:", error);
    }
  };


///////////// DELETE /////////////////////////////////////////////////////////////////
  const deleteSelectedDeck = async (e) => {
    if (!selectedDeck) {
      toast.error("No deck selected.");
      return;
    }

    if (!window.confirm(`Are you sure you want to delete ${selectedDeck.id}?`)) {
      return;
    }

    try {
      await axios.delete(`/profile/decks/${e.target.value}`);
      toast.success("Deck deleted successfully!");
      setDecks(decks.filter((deck) => deck.id !== e.target.value));
      setSelectedDeck(null);
      setCards([]);
      fetchDecks();
    } catch (error) {
      toast.error("Error deleting deck:", error);
    }
  };
  //////////////////////////////////////////////////////////////////////////////////////
  //////////////// LIFECYCLE /////////////////////////////////////////////////////
  
  useEffect(()=>{

    if (cards.length > 0){
      console.log("hello");
  
      setCurrDeckVal(cards.reduce((acc, curr)=>{
  
        acc += ((curr.armor + curr.damage) * (curr.duration + 1))
        return acc
  
      }, 0))
    }

  })

  useEffect(() => {
    




    const fetchAllCards = async () => {
      try {
        const response = await axios.get(`/profile/collections/${user.id}`);
        setAllCards(response.data);
      } catch (error) {
        toast.error("Error fetching all cards:", error);
      }
    };
    fetchAllCards();
    fetchDecks();

    


      // setCurrDeckVal(deckVal)
    

  }, [user.id]);

  // console.log("currDeckVal", currDeckVal)

  /////////////////////////////////// RENDER /////////////////////////////////////////////////
  return (
<div className='grid-cols-3 mt-10 p-5 pt-15 min-h-screen w-screen flex flex-row gap-4 justify-between'>

<div className='m-2 flex flex-col' style={{ width: "25%"}}>

  {/* Create New Deck */}
<div className="text-center mt-8 pt-24 z-10 relative flex flex-col gap-3 justify-center items-center justify-items-center" style={{width: "100%"}}>
        <button
          onClick={() => setShowNewDeckModal(true)}
          disabled={allSelectedCards.length === 0 || deckPoints > 200} // Disable if no cards selected OR if deck value above 200
          className={`px-4 py-2 rounded-lg shadow z-10 justify-center items-center relative ${
            allSelectedCards.length === 0 || deckPoints > 200
              ? "bg-slate-400 text-text dark:text-darkText cursor-not-allowed"
              : "bg-blue-600 text-text dark:text-darkText hover:bg-blue-500 cursor-pointer"
          }`}
        >
          Create New Deck
        </button>
      </div>

      <h4 className="text-text dark:text-darkText text-base mb-4 text-center z-10 relative">Current Card Values: {deckPoints}/200</h4>


 {/* Deck Buttons */}
 <div className="pt-8 pb-8 z-10 relative">
        <h2 className="text-text dark:text-darkText text-xl text-center font-semibold mb-4 z-10 relative ">Decks</h2>
        <div className="flex flex-wrap gap-4 justify-center z-10 relative">
          {decks.length > 0 ? (
            decks.map((deck) => (
              <button
                key={deck.id}
                onClick={() => fetchDeckCards(deck)}
                className={`px-4 py-2 rounded-lg shadow z-10 relative text-text dark:text-darkText hover:bg-yellow-500 dark:hover:bg-purple-500 ${
                  selectedDeck?.id === deck.id
                    ? "bg-yellow-600 text-text dark:bg-purple-600 dark:text-darkText animate-pulse"
                    : "bg-yellow-500 text-text dark:bg-purple-400 dark:text-darkText"
                }`}
              >
                {deck.deck_name}
              </button>
            ))
          ) : (
            <p className="text-text dark:text-darkText z-10 relative">No decks available.</p>
          )}
        </div>
      </div>

      {/* Selected Deck Actions */}
      {selectedDeck && (
        <div className="text-center mt-4 flex flex-col z-10 relative">
          <h2 className="text-white text-xl mb-4 z-10 relative justify-between">
            Cards in {selectedDeck.deck_name}
          </h2>
          <div className="grid xl:grid-cols-3 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 w-full max-w-screen-md gap-1 justify-start items-center z-10 relative " style={{ minWidth: '70%' }}>
            



            {cards.map((deckCard) => (


              <div
                key={deckCard.id}
                className={`relative bg-white border border-slate-300 hover:scale-110 hover:z-20 mx-1 first:ml-0 my-1 rounded-lg shadow-lg flex-col justify-items-center text-black text-center flex-shrink-0 z-10 h-48 w-32' 
                  ${
                    selectedCardsInDeck.includes(deckCard.id)
                      ? "border-error border-4 animate-pulse"
                      : ""
                  }`}
                style={{ flex: '0 0 25%', minWidth: "32px", aspectRatio: "3/4" }}
                // style={{ minWidth: '70%' }}
                onClick={() => toggleDeckCardSelection(deckCard.id)}
              >
                {/* Card Content */}
                <h2 className="text-md text-black font-bold mb-2 text-center">{deckCard.name}</h2>

                <div className="text-center">
                  <div>`IMAGE`</div>
                  <p className="text-black mb-1 text-sm">
                    <strong>Attack:</strong> {deckCard.damage}
                  </p>
                  <p className="text-black mb-1 text-sm">
                    <strong>Defense:</strong> {deckCard.armor}
                  </p>
                  <p className="text-black mb-1 text-sm">
                <strong>Duration:</strong> {deckCard.duration ? deckCard.duration + 1 : 1}
                </p>
                </div>
                <p className="text-black text-xs text-center">{deckCard.description}</p>
                </div>


            ))}






          </div>

          <div>Selected Deck Value: {currDeckVal}/200</div>


          <div className='items-center justify-items-center justify-center gap-2 flex z-10 relative'>
            <button
              onClick={removeCardsFromDeck}
              className="mt-4 px-4 py-2 rounded-lg bg-error text-white z-10 relative hover:bg-slate-400"
            >
              Confirm Remove Selected Cards
            </button>
            <button
              value={selectedDeck.id}
              onClick={(e) => deleteSelectedDeck(e)}
              className="mt-4 px-4 py-2 bg-error text-white rounded-lg shadow z-10 relative hover:bg-slate-400"
            >
              Delete Deck
            </button>
          </div>
        </div>
      )}



      {/* Add Cards to Deck Button */}
      {/* {console.log("SELECTED DECK's Cards TO ADD TO:  ", cards)} */}
      {/* {console.log("DECK VALUE PLUS NEW POINTS", currDeckVal + deckPoints)} */}
      {selectedDeck && (
        <div className="text-center mt-4 pb-2 z-10 relative">
          <div>
          </div>

        {currDeckVal + deckPoints > 200 ?
          <button
            
            className="cursor-not-allowed px-4 py-2 bg-gray text-text dark:text-darkText rounded-lg z-10 relative shadow"
          >
            Add Selected Cards to {selectedDeck.deck_name}
          </button>
      
      :

          <button
            onClick={() => {
              addCardsToDeck();
            }}
            className="px-4 py-2 bg-green-600 text-text dark:text-darkText rounded-lg z-10 relative shadow hover:bg-green-500"
          >
            Add Selected Cards to {selectedDeck.deck_name}
          </button>
        }
        </div>
      )}




      {/* New Deck Modal */}

      {showNewDeckModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="[background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)] p-8 rounded-lg shadow-lg flex flex-col items-center justify-items-center gap-3 z-50">
            <h2 className="text-xl text-center font-bold text-text mb-4">Create New Deck</h2>
            <input
              type="text"
              placeholder="Deck Name"
              value={newDeckName}
              onChange={(e) => setNewDeckName(e.target.value)}
              className="w-full p-2 border gap-3 border-slate-300 bg-slate-400 rounded-lg text-black mb-4 text-center"
            />
            <button
              onClick={()=>{
                createNewDeck()
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-500 mr-2 pb-2"
            >
              Create Deck
            </button>
            <button
              onClick={() => setShowNewDeckModal(false)}
              disabled={ deckPoints > 200 }
              className="px-4 py-2 bg-slate-700 text-white rounded-lg shadow hover:bg-slate-300"
            >
              Cancel
            </button>
          </div>
        </div>
      )}







      </div>

  <div className="flex-col flex justify-start" style={{ width: "70%"}}>
    <div className="grid-cols-3 sm:grid-cols-1 md:grid-cols-2 justify-items-center pt-10">

      <div className='bg-starfield-light dark:bg-starfield h-[200vh] inset-0 absolute z-9'></div>
      <h1 className="font-extrabold text-text dark:text-darkText text-3xl text-center pt-8 pb-1 z-10 relative">Armory</h1>
      <div className="border-t-4 border-yellow-400 w-3/5 pb-5 z-10 relative"></div>





      {/* All Cards Section */}
      <div className='h-auto justify-items-center justify-between z-10 relative gap-3 w-full' style={{ minWidth: '70%'}}>
        <h2 className="text-text dark:text-darkText text-xl mb-4 text-center z-10 relative">All Cards</h2>
        <ToastContainer position="bottom-right" />

        <div className="grid xl:grid-cols-8 lg:grid-cols-5 md:grid-cols-3 sm:grid-cols-2 h-48 w-min-32 gap-3 px-4 justify-start justify-items-center z-10 relative">
          {allCards.length > 0 ? (
            allCards.map((card) => (

              <div
              className={` border rounded-lg shadow-md flex flex-col h-48 w-32 items-center justify-between hover:scale-110 cursor-pointer 
                  ${allSelectedCards.includes(card.id)
                  ? "bg-green-500 border-green-700"
                  : "bg-white border-slate-300"
                              }"`}
                  // style={{  minWidth: '70%', maxWidth: '75%'}}
                  key={card.id}
                  onClick={() => toggleCardSelection(card.id)}

                  >

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
                <strong>Duration:</strong> {card.duration ? card.duration + 1 : 1}
              </p>
                    </div>
                    <p className="text-black text-xs text-center">{card.description}</p>
                  </div>

            ))
          ) : (
            <p className="text-text dark:text-darkText z-10 relative">No cards available.</p>
          )}
        </div>
      </div>
      {/* deck creation points counter */}
    <div>
    
    </div>







    </div>
    </div>



    <div className="flex-col flex justify-end" style={{ width: "5%"}}></div>



    </div>
  );
};

export default CardsPage;
