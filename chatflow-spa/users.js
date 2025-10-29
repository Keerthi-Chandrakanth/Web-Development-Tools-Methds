function isValidUsername(username) {
  let isValid = true;
  isValid = isValid && username.trim();
  isValid = isValid && username.match(/^[A-Za-z0-9_]+$/);
  return isValid;
}

function isValidMessage(message) {
  let isValid = true;
  isValid = isValid && message.trim(); 
  return isValid;
}

module.exports = {
  isValidUsername,
  isValidMessage,
};