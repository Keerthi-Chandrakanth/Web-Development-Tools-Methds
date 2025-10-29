import { 
  getState, 
  setState, 
  resetState, 
  setLoginState, 
  setErrorState, 
  setMessagesState, 
  setUsersState, 
  setLoadingState 
} from './model.js';
import { 
  fetchLogin, 
  fetchSession, 
  fetchLogout, 
  fetchMessages, 
  fetchSendMessage, 
  fetchUsers 
} from './services.js';
import render from './view.js';

let rootEl;
let pollingInterval;

function init(appEl) {
  rootEl = appEl;
  addEventListeners();
  checkExistingSession();
}

function addEventListeners() {
  rootEl.addEventListener('submit', (event) => {
    event.preventDefault();
    
    if (event.target.classList.contains('login-form')) {
      handleLogin(event.target);
    } else if (event.target.classList.contains('message-form')) {
      handleSendMessage(event.target);
    }
  });
  
  rootEl.addEventListener('click', (event) => {
    if (event.target.classList.contains('logout-button')) {
      handleLogout();
    }
  });
}

function handleLogin(form) {
  const formData = new FormData(form);
  const username = formData.get('username');
  
  setErrorState('');
  setLoadingState(true);
  updateView();
  
  fetchLogin(username)
    .then(response => {
      setLoginState(response.username);
      updateView();
      loadChatData();
      startPolling();
    })
    .catch(error => {
      let errorMessage = 'Login failed. Please try again.';
      
      if (error.error === 'auth-insufficient') {
        errorMessage = 'Username "dog" is not allowed.';
      } else if (error.error === 'required-username') {
        errorMessage = 'Please enter a valid username (letters, numbers, and underscores only).';
      } else if (error.error === 'network-error') {
        errorMessage = 'Network error. Please check your connection and try again.';
      }
      
      setErrorState(errorMessage);
      setLoadingState(false);
      updateView();
    });
}

function handleLogout() {
  stopPolling();
  
  fetchLogout()
    .then(() => {
      resetState();
      updateView();
    })
    .catch(error => {
      console.warn('Logout error:', error);
      resetState();
      updateView();
    });
}

function handleSendMessage(form) {
  const formData = new FormData(form);
  const text = formData.get('message');
  
  setErrorState('');
  
  fetchSendMessage(text)
    .then(response => {
      form.reset();
      loadChatData();
      setErrorState('');
    })
    .catch(error => {
      let errorMessage = 'Failed to send message. Please try again.';
      
      if (error.error === 'auth-missing') {
        stopPolling();
        setState({
          isLoggedIn: false,
          username: '',
          messages: [],
          users: [],
          errorMessage: 'Session expired. Please log in again.'
        });
        updateView();
        return;
      } else if (error.error === 'required-message') {
        errorMessage = 'Message cannot be empty.';
      } else if (error.error === 'network-error') {
        errorMessage = 'Network error. Please check your connection and try again.';
      }
      
      setErrorState(errorMessage);
      updateView();
    });
}

function loadChatData() {
  Promise.all([fetchMessages(), fetchUsers()])
    .then(([messagesResponse, usersResponse]) => {
      setMessagesState(messagesResponse.messages);
      setUsersState(usersResponse.users);
      setErrorState('');
      updateChatContentOnly();
    })
    .catch(error => {
      if (error.error === 'auth-missing') {
        stopPolling();
        setState({
          isLoggedIn: false,
          username: '',
          messages: [],
          users: [],
          errorMessage: 'Session expired. Please log in again.'
        });
        updateView();
      } else {
        setErrorState('Failed to load chat data. Please refresh the page.');
        updateView();
      }
    });
}

function startPolling() {
  pollingInterval = setInterval(() => {
    loadChatData();
  }, 5000);
}

function stopPolling() {
  if (pollingInterval) {
    clearInterval(pollingInterval);
    pollingInterval = null;
  }
}

function checkExistingSession() {
  fetchSession()
    .then(response => {
      setLoginState(response.username);
      updateView();
      loadChatData();
      startPolling();
    })
    .catch(error => {
      setLoadingState(false);
      updateView();
    });
}

function updateView() {
  const state = getState();
  render(state, rootEl);
}

function updateChatContentOnly() {
  const state = getState();
  
  const messagesContainer = rootEl.querySelector('.messages-container');
  const usersContainer = rootEl.querySelector('.users-list');
  
  if (messagesContainer) {
    const messagesHtml = generateMessagesHtml(state.messages);
    messagesContainer.innerHTML = messagesHtml;
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }
  
  if (usersContainer) {
    const usersHtml = generateUsersHtml(state.users);
    usersContainer.innerHTML = usersHtml;
  }
}

function generateMessagesHtml(messages) {
  if (!messages || messages.length === 0) {
    return '<div class="no-messages">No messages yet. Start the conversation!</div>';
  }
  
  const messagesHtml = messages.map(message => `
    <div class="message">
      <div class="message-username">${escapeHtml(message.username)}</div>
      <div class="message-text">${escapeHtml(message.text)}</div>
    </div>
  `).join('');
  
  return messagesHtml;
}

function generateUsersHtml(users) {
  if (!users || users.length === 0) {
    return '<div class="user-item">No users online</div>';
  }
  
  const usersHtml = users.map(user => `
    <div class="user-item">${escapeHtml(user)}</div>
  `).join('');
  
  return usersHtml;
}

function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

export { init };