"use strict";
const words = require('./words');

const sessions = {};
const bestScores = {};
const userGames = {};

function isValidUsername(username) {
  const allowed = /^[a-zA-Z0-9_]+$/;
  return username !== 'dog' && allowed.test(username);
}

function countCommonLetters(word1, word2) {
  let matches = 0;
  const letterCount = {};
for (let letter of word1.toLowerCase()) {
    letterCount[letter] = (letterCount[letter] || 0) + 1;
  }

  for (let letter of word2.toLowerCase()) {
    if (letterCount[letter] > 0) {
      letterCount[letter] -= 1;
      matches += 1;
    }
  }
return matches;
}


function startNewGame(username) {
  const secretWord = words[Math.floor(Math.random() * words.length)];
  userGames[username] = {
    secret: secretWord,
    guesses: [],
    lastGuess: null,
    gameOver: false,
  };
  console.log(`New game started for ${username}, word: ${secretWord}`);
}

function makeGuess(username, guess) {
  const game = userGames[username];
  if (!game || game.gameOver) return;

  if (typeof guess !== 'string' || !guess.trim()) {
    game.lastGuess = {
      word: '',
      type: 'invalid'
    };
    return;
  }
  const word = guess.toLowerCase().trim();
  const isInvalid = !words.includes(word) || game.guesses.includes(word);

  if (isInvalid) {
    game.lastGuess = {
      word,
      type: 'invalid'
    };
    return;
  }

  game.guesses.push(word);

  if (word === game.secret.toLowerCase()) {
    game.lastGuess = {
      word,
      type: 'correct',
      match: word.length
    };
  game.gameOver = true;
  const guessCount = game.guesses.length;
  
  if (!bestScores[username] || guessCount < bestScores[username]) {
      bestScores[username] = guessCount;
    }
  } else {
    const match = countCommonLetters(word, game.secret);
    game.lastGuess = {
      word,
      type: 'incorrect',
      match
    };
  }
}

function getSessionUser(sid) {
  return sessions[sid];
}

function setSession(sid, username) {
  sessions[sid] = username;
}

function clearSession(sid) {
  delete sessions[sid];
}

function getGame(username) {
  return userGames[username];
}

function hasExistingGame(username) {
  return !!userGames[username];
}

function getLeaderboard() {
  return Object.entries(bestScores)
    .sort((a, b) => a[1] - b[1])  
    .slice(0, 5);                 
}

module.exports = {
  sessions,
  userGames,
  isValidUsername,
  countCommonLetters,
  startNewGame,
  makeGuess,
  getSessionUser,
  setSession,
  clearSession,
  getGame,
  hasExistingGame,
  getLeaderboard
};
