const sessions = {};

const makeSession = (sessionId, player1Id) =>{
  sessions[sessionId] = [player1Id, ""]
}

const joinSession = (sessionId, player2Id) =>{
  sessions[sessionId][1] = player2Id;
}

const exitSession = (sessionId, player) =>{
  if(player === 1){
    delete sessions[sessionId];
  } else {
    sessions[sessionId][1] = ''
  }
}
module.exports = { sessions, makeSession, joinSession, exitSession }