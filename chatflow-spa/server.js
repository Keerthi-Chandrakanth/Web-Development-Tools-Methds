const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = 3000;

const sessions = require('./sessions');
const users = require('./users');
const messages = require('./messages');

app.use(cookieParser());
app.use(express.static('./public'));
app.use(express.json());


app.get('/api/v1/session', (req, res) => {
  const sid = req.cookies.sid;
  const username = sid ? sessions.getSessionUser(sid) : '';
  if(!sid || !username) {
    res.status(401).json({ error: 'auth-missing' });
    return;
  }
  res.json({ username });
});


app.post('/api/v1/session', (req, res) => {
  const { username } = req.body;

  if(!users.isValidUsername(username)) {
    res.status(400).json({ error: 'required-username' });
    return;
  }

  if(username === 'dog') {
    res.status(403).json({ error: 'auth-insufficient' });
    return;
  }

  const sid = sessions.addSession(username);
  res.cookie('sid', sid);
  res.json({ username });
});


app.delete('/api/v1/session', (req, res) => {
  const sid = req.cookies.sid;
  const username = sid ? sessions.getSessionUser(sid) : '';

  if(sid) {
    res.clearCookie('sid');
  }

  if(username) {
    sessions.deleteSession(sid);
  }

  res.json({ wasLoggedIn: !!username });
});


app.get('/api/v1/messages', (req, res) => {
  const sid = req.cookies.sid;
  const username = sid ? sessions.getSessionUser(sid) : '';

  if(!sid || !username) {
    res.status(401).json({ error: 'auth-missing' });
    return;
  }

  const messageList = messages.getMessages();
  res.json({ messages: messageList });
});


app.post('/api/v1/messages', (req, res) => {
  const sid = req.cookies.sid;
  const username = sid ? sessions.getSessionUser(sid) : '';

  if(!sid || !username) {
    res.status(401).json({ error: 'auth-missing' });
    return;
  }

  const { text } = req.body;

  if(!text || !users.isValidMessage(text)) {
    res.status(400).json({ error: 'required-message' });
    return;
  }

  const message = messages.addMessage(username, text);
  res.json({ message });
});

app.get('/api/v1/messages/since/:lastId', (req, res) => {
  const sid = req.cookies.sid;
  const username = sid ? sessions.getSessionUser(sid) : '';

  if(!sid || !username) {
    res.status(401).json({ error: 'auth-missing' });
    return;
  }

  const lastId = parseInt(req.params.lastId);
  const messageList = messages.getMessages();
  const newMessages = messageList.filter(message => message.id > lastId);
  
  res.json({ messages: newMessages });
});



app.get('/api/v1/users', (req, res) => {
  const sid = req.cookies.sid;
  const username = sid ? sessions.getSessionUser(sid) : '';

  if(!sid || !username) {
    res.status(401).json({ error: 'auth-missing' });
    return;
  }

  const userList = sessions.getLoggedInUsers();
  res.json({ users: userList });
});

app.listen(PORT, () => console.log(`http://localhost:${PORT}`));