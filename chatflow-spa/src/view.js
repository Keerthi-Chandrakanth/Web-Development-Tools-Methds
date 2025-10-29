function render(state, rootEl) {
  if (state.isLoading) {
    const html = generateLoadingHtml();
    rootEl.innerHTML = html;
    return;
  }
  
  if (state.isLoggedIn) {
    const html = generateChatViewHtml(state);
    rootEl.innerHTML = html;
  } else {
    const html = generateLoginViewHtml(state);
    rootEl.innerHTML = html;
  }
}

function renderMessagesAndUsers(state, rootEl) {
  const messagesContainer = rootEl.querySelector('.messages-container');
  if (messagesContainer) {
    const messagesHtml = generateMessagesHtml(state.messages);
    messagesContainer.innerHTML = messagesHtml;
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }
  
  const usersContainer = rootEl.querySelector('.users-list');
  if (usersContainer) {
    const usersHtml = generateUsersListHtml(state.users);
    usersContainer.innerHTML = usersHtml;
  }
}

function generateLoadingHtml() {
  return `
    <div class="loading">
      <p>Loading...</p>
    </div>
  `;
}

function generateLoginViewHtml(state) {
  const errorHtml = state.errorMessage ? generateErrorHtml(state.errorMessage) : '';
  const formHtml = generateLoginFormHtml();
  
  return `
    <div class="login-section">
      <h2>Login to Chat</h2>
      ${errorHtml}
      ${formHtml}
    </div>
  `;
}

function generateChatViewHtml(state) {
  const userInfoHtml = generateUserInfoHtml(state.username);
  const chatContentHtml = generateChatContentHtml(state);
  
  return `
    <div class="chat-section">
      ${userInfoHtml}
      ${chatContentHtml}
    </div>
  `;
}

function generateChatContentHtml(state) {
  const usersListHtml = generateUsersListHtml(state.users);
  const messagesHtml = generateMessagesHtml(state.messages);
  const errorHtml = state.errorMessage ? generateErrorHtml(state.errorMessage) : '';
  const messageFormHtml = generateMessageFormHtml();
  
  return `
    <div class="chat-content">
      <div class="users-panel">
        <h3>Online Users</h3>
        ${usersListHtml}
      </div>
      <div class="messages-panel">
        <div class="messages-container">
          ${messagesHtml}
        </div>
        ${errorHtml}
        ${messageFormHtml}
      </div>
    </div>
  `;
}

function generateErrorHtml(errorMessage) {
  return `<div class="error-message">${escapeHtml(errorMessage)}</div>`;
}

function generateLoginFormHtml() {
  return `
    <form class="login-form">
      <div class="form-group">
        <label for="username-input">Username:</label>
        <input type="text" id="username-input" name="username" required>
      </div>
      <button type="submit">Login</button>
    </form>
  `;
}

function generateUserInfoHtml(username) {
  return `
    <div class="user-info">
      <div class="username-display">Welcome, ${escapeHtml(username)}!</div>
      <button class="logout-button" type="button">Logout</button>
    </div>
  `;
}

function generateUsersListHtml(users) {
  if (!users || users.length === 0) {
    return '<div class="users-list">No users online</div>';
  }
  
  let usersHtml = '';
  for (const user of users) {
    usersHtml += `<div class="user-item">${escapeHtml(user)}</div>`;
  }
  
  return `<div class="users-list">${usersHtml}</div>`;
}

function generateMessagesHtml(messages) {
  if (!messages || messages.length === 0) {
    return '<div class="no-messages">No messages yet. Start the conversation!</div>';
  }
  
  let messagesHtml = '';
  for (const message of messages) {
    messagesHtml += `
      <div class="message">
        <div class="message-username">${escapeHtml(message.username)}</div>
        <div class="message-text">${escapeHtml(message.text)}</div>
      </div>
    `;
  }
  
  return messagesHtml;
}

function generateMessageFormHtml() {
  return `
    <form class="message-form">
      <div class="form-group message-input-group">
        <label for="message-input">Message:</label>
        <input type="text" id="message-input" name="message" placeholder="Type your message..." required>
        <button type="submit">Send</button>
      </div>
    </form>
  `;
}

function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

export default render;
export { renderMessagesAndUsers };