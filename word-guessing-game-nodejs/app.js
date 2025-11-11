"use strict";
const express = require('express');
const cookieParser = require('cookie-parser');
const crypto = require('crypto');
const controller = require('./controller');

const app = express();
const PORT = 3000;

app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('./public'));

// Routes
app.get('/', controller.handleHome);
app.get('/login', controller.handleLoginPage);
app.post('/login', controller.handleLogin);
app.post('/logout', controller.handleLogout);
app.post('/guess', controller.handleGuess);
app.post('/new-game', controller.handleNewGame);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});