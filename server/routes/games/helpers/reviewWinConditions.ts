import database from "../../../db/index.ts";

export default function reviewWinConditions(players: any) {

    let victor = null;

    let userOneHealth = players[0].health;
    let userTwoHealth = players[1].health;

    // if player two reduced player one's health to 0
    if (userOneHealth <= 0 && userTwoHealth > 0) {

      victor = players[1].user_id;

    // if player one reduced player two's health to 0
    } else if (userTwoHealth <= 0 && userOneHealth > 0) {

      victor = players[0].user_id;

    // if both player's health is below 0
    } else if (userTwoHealth <= 0 && userOneHealth <= 0) {

      victor = (userTwoHealth > userOneHealth) ? players[1].user_id : players[0].user_id;

    }

    return victor;

}