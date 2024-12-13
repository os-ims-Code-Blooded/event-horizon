export default function calculatePlayerState(players: any, updates: any, nextRound: number) {

  let updatedPlayers = players.map((player: any) => {

    for (const key in updates) {

      if (Number(key) === player.user_id) {
        player.armor += updates[key].armor;
      } else {
        if (updates[player.user_id].isBlocking === true) {
          player.armor -= (Math.round(updates[key].damage * 0.50));
        } else {
          player.armor -= updates[key].damage;
        }
      }
    }

    return player;

  })

  updatedPlayers = players.map((player: any) => {
    const damageReceived = (player.armor <= 0) ? player.armor : 0;
    const newArmor = (player.armor > 0) ? player.armor : 0;
    const newHealth = player.health + damageReceived;

    return {
      user: {connect: { id: player.user_id } },
      armor: newArmor,
      health: newHealth,
      round: {connect: { id: nextRound } }
    }

  })

  return updatedPlayers;

}