"use strict";
const crypto = require('crypto');
const model = require('./model');
const view = require('./view');
const words = require('./words');

function getUsernameOrRedirect(req, res) {
  const sid = req.cookies.sid;
  const username = model.getSessionUser(sid);
  if (!username) {
    res.redirect('/login');
    return null;
  }
  return username;
}

function handleHome(req, res) {
 const username = getUsernameOrRedirect(req, res);
  if (!username) return;
  const game = model.getGame(username);
  const leaderboard = model.getLeaderboard();
  const html = view.renderHomePage(username, game, words, leaderboard);
  res.send(html);
}

function handleLoginPage(req, res) {
  res.send(view.renderLoginPage());
}

function handleLogin(req, res) {
  const { username } = req.body;
  if (!model.isValidUsername(username)) {
    res.send(view.renderLoginPage('Invalid username. Only letters, numbers, _ allowed. Not "dog".'));
    return;
  }
  const sid = crypto.randomUUID();
  model.setSession(sid, username);
  if (!model.hasExistingGame(username)) {
    model.startNewGame(username);
  }
  res.cookie('sid', sid);
  res.redirect('/');
}

function handleLogout(req, res) {
 const sid = req.cookies.sid;
 if (sid) {
    model.clearSession(sid);
    res.clearCookie('sid');
 }
 res.redirect('/login');
}

function handleGuess(req, res) {
  const username = getUsernameOrRedirect(req, res);
  if (!username) return;
  const guess = req.body.guess;
  model.makeGuess(username, guess);
  res.redirect('/');
}

function handleNewGame(req, res) {
  const username = getUsernameOrRedirect(req, res);
  if (!username) return;
  model.startNewGame(username);
  res.redirect('/');
}

module.exports = {
  handleHome,
  handleLoginPage,
  handleLogin,
  handleLogout,
  handleGuess,
  handleNewGame,
} 