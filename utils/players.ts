const connectedUsers = {};
const choices = {};
const moves = {
  "block": "shoot" || "load",
  "shoot": "load",
  "load": "block" || "load",
};

const initializeChoices = (sessionId) =>{
  choices[sessionId] = ['', '']
}

const userConnected = (userId) =>{
  connectedUsers[userId] = true
}

const makeMove = (sessionId, player, choice) =>{
  if (choices[sessionId]){
    choices[sessionId][player - 1] = choice
  }
}

module.exports = {connectedUsers, initializeChoices, userConnected, makeMove, moves, choices};