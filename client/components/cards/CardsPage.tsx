import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import { toast, ToastContainer } from 'react-toastify';

type Deck = {
  id: number;
  deck_name: string;
};

type Card = {
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
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [newDeckName, setNewDeckName] = useState<string>("");
  const [showNewDeckModal, setShowNewDeckModal] = useState(false);
  const [deckPoints, setDeckPoints] = useState(200)


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

  const toggleCardSelection = (cardId: number) => {
    setSelectedCards((prevSelected) =>
      prevSelected.includes(cardId)
        ? prevSelected.filter((id) => id !== cardId)
        : [...prevSelected, cardId]
    );
  };

  const addCardsToDeck = async () => {
    if (!selectedDeck || selectedCards.length === 0) {
      toast.error("Please select a deck and at least one card.");
      return;
    }

    try {
      const payload = {
        data: {
          deck_id: selectedDeck.id,
          add_cards: selectedCards,
        },
      };

      await axios.patch(`/profile/decks/${user.id}`, payload);

      fetchDeckCards(selectedDeck);
      toast.success("Cards added to deck successfully!");
      fetchDecks();
      setSelectedCards([]);

    } catch (error) {
      toast.error("Error adding cards to deck:", error);
    }
  };

  const removeCardsFromDeck = async () => {
    if (!selectedDeck || selectedCards.length === 0) {
      toast.error("Please select a deck and at least one card.");
      return;
    }

    const confirmRemoval = window.confirm("Are you sure you want to remove the selected cards from the deck?");
    if (!confirmRemoval) return;

    try {
      console.log('ALL CARDS', cards);
      const actualCardIds = cards
      .filter((card) => selectedCards.includes(card.id))
      .map((card) => card.card_id);

      const payload = {
        data: {
          deck_id: selectedDeck.id,
          delete_cards: actualCardIds,
        },
      };
      setCards((prevCards) =>
        prevCards.filter((card) => !selectedCards.includes(card.id))
      );
      await axios.patch(`/profile/decks/${user.id}`, payload);

      toast.success("Cards removed from deck successfully!");
      setSelectedCards([]);
      fetchDeckCards(selectedDeck);
      fetchDecks();
    } catch (error) {
      toast.error("Error removing cards from deck:", error);
    }
  };

  const createNewDeck = async () => {
    if (!newDeckName.trim() || selectedCards.length === 0) {
      toast.error("Please provide a deck name and select at least one card.");
      return;
    }

    try {
      await axios.post(`/profile/decks/${user.id}`, {
        data: {
          deck_name: newDeckName.trim(),
          cards: selectedCards,
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
      setSelectedCards([]);
      fetchDeckCards(newDeck);
      fetchDecks();
      setShowNewDeckModal(false);
    } catch (error) {
      toast.error("Error creating new deck:", error);
    }
  };

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
  }, [user.id]);

  return (
    <div className="grid-cols-3 sm:grid-cols-1 md:grid-cols-2 justify-items-center pt-10 min-h-screen w-full bg-radial-custom">
      <h1 className="font-extrabold text-white text-3xl text-center pt-8 pb-1">Cards Page</h1>
      <div className="border-t-4 border-yellow-400 w-3/5 pb-5"></div>
      {/* All Cards Section */}
      <div>
        <h2 className="text-white text-xl mb-4 text-center">All Cards</h2>
        <ToastContainer position="bottom-right" />
        <div className="flex flex-wrap gap-4 justify-center">
          {allCards.length > 0 ? (
            allCards.map((card) => (
              <div
                key={card.id}
                onClick={() => toggleCardSelection(card.id)}
                className={`relative w-36 h-48 border rounded-lg shadow-lg flex flex-col justify-items-center text-black text-center cursor-pointer ${
                  selectedCards.includes(card.id)
                    ? "bg-green-500 border-green-700"
                    : "bg-white border-slate-300"
                }`}
              >
                <div className="font-semibold pb-1">{card.name}</div>
                <div className="px-1">{card.image_url || "IMAGE"}</div>
                <div className="pt-4 text-sm">{card.description}</div>
                <div className="absolute bottom-0 right-0 left-0 flex flex-row justify-between px-1">
                  <div className="p-1">
                    <strong>ATK:</strong> {card.damage}
                  </div>
                  <div className="p-1">
                    <strong>AMR:</strong> {card.armor}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-slate-300">No cards available.</p>
          )}
        </div>
      </div>

      {/* Deck Buttons */}
      <div className="pt-8 pb-8">
        <h2 className="text-white text-xl text-center font-semibold mb-4">Decks</h2>
        <div className="flex flex-wrap gap-4 justify-center">
          {decks.length > 0 ? (
            decks.map((deck) => (
              <button
                key={deck.id}
                onClick={() => fetchDeckCards(deck)}
                className={`px-4 py-2 rounded-lg shadow hover:bg-yellow-500 dark:hover:bg-purple-500 ${
                  selectedDeck?.id === deck.id
                    ? "bg-yellow-600 text-white dark:bg-purple-600 dark:text-black animate-pulse"
                    : "bg-yellow-500 text-white dark:bg-purple-400 dark:text-black"
                }`}
              >
                {deck.deck_name}
              </button>
            ))
          ) : (
            <p className="text-slate-300">No decks available.</p>
          )}
        </div>
      </div>

      {/* Selected Deck Actions */}
      {selectedDeck && (
        <div className="text-center mt-4">
          <h2 className="text-white text-xl mb-4">
            Cards in {selectedDeck.deck_name}
          </h2>
          <div className="flex flex-wrap gap-4 justify-center">
            {cards.map((card) => (
              <div
                key={card.id}
                className={`relative w-36 h-48 bg-white border border-slate-300 rounded-lg shadow-lg flex flex-col justify-items-center text-black text-center ${
                  selectedCards.includes(card.id) ? "border-error border-4 animate-pulse" : ""
                }`}
                onClick={() => toggleCardSelection(card.id)}
              >
                <div className="font-semibold pb-1">{card.name}</div>
                <div className="px-1">{card.image_url || "IMAGE"}</div>
                <div className="pt-4 text-sm">{card.description}</div>
                <div className="absolute bottom-0 right-0 left-0 flex flex-row justify-between px-1">
                  <div className="p-1">
                    <strong>ATK:</strong> {card.damage || 0}
                  </div>
                  <div className="p-1">
                    <strong>AMR:</strong> {card.armor || 0}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className='items-end justify-items-end justify-end gap-1 flex'>
            <button
              onClick={removeCardsFromDeck}
              className="mt-4 px-4 py-2 rounded-lg bg-error text-white hover:bg-slate-400"
            >
              Confirm Remove Selected Cards
            </button>
            <button
              value={selectedDeck.id}
              onClick={(e) => deleteSelectedDeck(e)}
              className="mt-4 px-4 py-2 bg-error text-white rounded-lg shadow hover:bg-slate-400"
            >
              Delete Deck
            </button>
          </div>
        </div>
      )}

      {/* Add Cards to Deck Button */}
      {selectedDeck && (
        <div className="text-center mt-4 pb-2">
          <button
            onClick={() => {
              addCardsToDeck();
            }}
            className="px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-500"
          >
            Add Selected Cards to {selectedDeck.deck_name}
          </button>
        </div>
      )}

      {/* Create New Deck */}
      <div className="text-center mt-8 pb-4">
        <button
          onClick={() => setShowNewDeckModal(true)}
          disabled={selectedCards.length === 0} // Disable if no cards are selected
          className={`px-4 py-2 rounded-lg shadow ${
            selectedCards.length === 0
              ? "bg-slate-400 text-white cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-500 cursor-pointer"
          }`}
        >
          Create New Deck
        </button>
      </div>
      {/* New Deck Modal */}
      {showNewDeckModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="[background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)] p-8 rounded-lg shadow-lg flex flex-col items-center justify-items-center gap-3">
            <h2 className="text-xl text-center font-bold text-white mb-4">Create New Deck</h2>
            <input
              type="text"
              placeholder="Deck Name"
              value={newDeckName}
              onChange={(e) => setNewDeckName(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded-lg mb-4 text-center"
            />
            <button
              onClick={createNewDeck}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-500 mr-2 pb-2"
            >
              Create Deck
            </button>
            <button
              onClick={() => setShowNewDeckModal(false)}
              className="px-4 py-2 bg-slate-700 text-white rounded-lg shadow hover:bg-slate-300"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CardsPage;
