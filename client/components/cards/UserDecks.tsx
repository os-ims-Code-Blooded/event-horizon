import React, { FC } from 'react';

type userDeckProps = {
  updateView: Function;
  view: string;
  user: Object | null;
  logOut: Function;
  getUser: Function;
};

const UserDecks: FC<userDeckProps> = () => {
  const decks = [
    {
      deck_name: 'Attack',
      cards: [
        {
          name: 'Bomba',
          attack: 15,
          defense: 0,
          description: 'Increase Attack Power of your bullet',
        },
        {
          name: 'Rocket',
          attack: 20,
          defense: 0,
          description: 'Explosive attack dealing area damage.',
        },
      ],
    },
    {
      deck_name: 'Defense',
      cards: [
        {
          name: 'Plasma Shield',
          attack: 0,
          defense: 15,
          description: 'Increase Defense Power of your shield',
        },
        {
          name: 'Barrier',
          attack: 0,
          defense: 20,
          description: 'Impenetrable wall for ultimate defense.',
        },
      ],
    },
  ];

  return (
    <div className="bg-indigo-500 flex flex-col items-center">
      <h1 className="text-white text-2xl font-bold my-4">User's Built Decks</h1>
      <div className="w-full">
        {decks.map((deck, index) => (
          <div
            key={index}
            className="p-4 bg-indigo-700 text-white m-2 rounded shadow-lg"
          >
            <h2 className="font-bold text-lg">{deck.deck_name} Deck</h2>
            <div className="mt-2">
              {deck.cards.map((card, cardIndex) => (
                <div
                  key={cardIndex}
                  className="p-2 bg-indigo-600 my-2 rounded"
                >
                  <h3 className="font-semibold">{card.name}</h3>
                  <p>Attack: {card.attack}</p>
                  <p>Defense: {card.defense}</p>
                  <p>{card.description}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserDecks;
