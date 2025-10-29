const messages = [];

function addMessage(username, text) {
  const message = {
    id: Date.now() + Math.random(), 
    username,
    text,
    timestamp: Date.now(),
  };
  messages.push(message);
  return message;
}

function getMessages() {
  return messages;
}

module.exports = {
  addMessage,
  getMessages,
};