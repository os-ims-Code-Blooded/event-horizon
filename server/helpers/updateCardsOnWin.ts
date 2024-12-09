import database from "../database/index.ts";

export default async function updateCardsOnWin(userID: string | number) {

  try {

    // find the user's score
    const userScore = await database.user.findUnique({
      where: {
        id: Number(userID)
      },
      select: {
        score: true
      }
    })

    // find the score required and the IDs of all cards
    const allCards = await database.cards.findMany({
      select: {
        score_required: true,
        id: true
      }
    })

    // if the user's score meets card recommendations, they should have these cards (array of card IDs)
    const earnedCards = allCards.reduce((accum, curr) => {
      if (curr.score_required <= userScore.score){
        accum.push(curr.id);
        return accum;
      } else {
        return accum;
      }
    }, [])

    // find all cards that the user has been assigned
    const userCards = await database.user_Cards.findMany({
      where: {
        user_id: Number(userID)
      }
    })

    // the current cards that have been given to a user
    const userCurrentCards = userCards.map((card) => {
      return card.card_id;
    })

    // I have earned these cards, they are assigned to my account and me as a user [1, 2, 3, 4...]
    // I have TECHNICALLY earned these cards, but have not been given them yet [...5, 6, 7]
    // represents all cards that a user has earned, but has not been given
    const cardsToAdd = earnedCards.filter((card: number) => {
      if (!userCurrentCards.includes(card)) {
        return card;
      }
    });

    // if there are cards to add to the user
    if (cardsToAdd.length > 0){

      // we use a loop here because createMany cannot be used for relationships
      cardsToAdd.forEach( async (id) => {
        await database.user_Cards.create({
          data: {
            card: { connect: { id: Number(id) } },
            user: { connect: { id: Number(userID) } }
          }
        })
      })
    } else {
    }

  } catch (error) {
    throw new Error(error);
  }

}

