const uuid = require('crypto').randomUUID;

const sessions = {};

function addSession(username) {
  const sid = uuid();
  sessions[sid] = {
    username,
  };
  return sid;
}

function getSessionUser(sid) {
  return sessions[sid]?.username;
}

function deleteSession(sid) {
  delete sessions[sid];
}

function getLoggedInUsers() {
  const users = new Set();
  Object.values(sessions).forEach(session => {
    users.add(session.username);
  });
  return Array.from(users);
}

module.exports = {
  addSession,
  deleteSession,
  getSessionUser,
  getLoggedInUsers,
};