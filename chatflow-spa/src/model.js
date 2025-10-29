const state = {
  isLoggedIn: false,
  username: '',
  messages: [],
  users: [],
  errorMessage: '',
  isLoading: true
};

function getState() {
  return state;
}

function setState(newState) {
  Object.assign(state, newState);
}

function resetState() {
  setState({
    isLoggedIn: false,
    username: '',
    messages: [],
    users: [],
    errorMessage: '',
    isLoading: false
  });
}

function setLoginState(username) {
  setState({
    isLoggedIn: true,
    username: username,
    errorMessage: '',
    isLoading: false
  });
}

function setErrorState(errorMessage) {
  setState({
    errorMessage: errorMessage
  });
}

function setMessagesState(messages) {
  setState({
    messages: messages
  });
}

function setUsersState(users) {
  setState({
    users: users
  });
}

function setLoadingState(isLoading) {
  setState({
    isLoading: isLoading
  });
}

export {
  getState,
  setState,
  resetState,
  setLoginState,
  setErrorState,
  setMessagesState,
  setUsersState,
  setLoadingState
};