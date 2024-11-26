export default function calculatePlayerState(players: any, updates: any, nextRound: number) {

  let updatedPlayers = players.map((player: any) => {

    console.log(`calculatePlayerState.ts : 5 | Calculating player state for User #${player.user_id}.`);

    // update player values to reflect
    for (const key in updates) {

      if (Number(key) === player.user_id) {
        console.log(`calculatePlayerState.ts : 10 | Processing buffs for User #${player.user_id}; current armor is ${player.armor}-armor.`);
        player.armor += updates[key].armor;
        console.log(`calculatePlayerState.ts : 10 | Player armor after buff for User #${player.user_id} is ${player.armor}-armor.`);
      } else {
        if (updates[player.user_id].isBlocking === true) {
          console.log(`calculatePlayerState.ts : 15 | User #${player.user_id} with ${player.armor}-armor is blocking ${updates[key].damage}-damage.`);
          console.log(`calculatePlayerState.ts : 16 | Incoming ${updates[key].damage}-damage diminishes to ${Math.round(updates[key].damage * 0.50)}-damage due to blocking.`);
          player.armor -= (Math.round(updates[key].damage * 0.50));
          console.log(`calculatePlayerState.ts : 18 | User #${player.user_id} current armor after receiving damage is ${player.armor}-armor.`);
        } else {
          console.log(`calculatePlayerState.ts : 20 | User #${player.user_id} with ${player.armor}-armor is receiving ${updates[key].damage}-damage.`);
          player.armor -= updates[key].damage;
          console.log(`calculatePlayerState.ts : 22 | User #${player.user_id} current armor after receiving damage is ${player.armor}-armor.`);
        }
      }
    }

    return player;
  })

  updatedPlayers = players.map((player: any) => {

    console.log(`calculatePlayerState.ts : 32 | Applying calculations to User #${player.user_id}.`);

    const damageReceived = (player.armor <= 0) ? player.armor : 0;
    const newArmor = (player.armor > 0) ? player.armor : 0;
    const newHealth = player.health + damageReceived;

    console.log(`calculatePlayerState.ts : 32 | User #${player.user_id} summary: ${newHealth}-HP | ${newArmor}-armor.`);

    return {
      user_id: player.user_id,
      armor: newArmor,
      health: newHealth,
      round_id: nextRound
    }

  })

  return updatedPlayers;

}