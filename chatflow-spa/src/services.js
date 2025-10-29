export function fetchLogin(username) {
  return fetch('/api/v1/session', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({ username }),
  })
  .catch(err => Promise.reject({ error: 'network-error' }))
  .then(response => {
    if(!response.ok) {
      return response.json().then(err => Promise.reject(err));
    }
    return response.json();
  });
}

export function fetchSession() {
  return fetch('/api/v1/session')
  .catch(err => Promise.reject({ error: 'network-error' }))
  .then(response => {
    if (!response.ok) {
      return response.json().then(err => Promise.reject(err));
    }
    return response.json();
  });
}

export function fetchLogout() {
  return fetch('/api/v1/session', {
    method: 'DELETE',
  })
  .catch(err => Promise.reject({ error: 'network-error' }))
  .then(response => {
    if (!response.ok) {
      return response.json().then(err => Promise.reject(err));
    }
    return response.json();
  });
}

export function fetchMessages() {
  return fetch('/api/v1/messages')
  .catch(err => Promise.reject({ error: 'network-error' }))
  .then(response => {
    if (!response.ok) {
      return response.json().then(err => Promise.reject(err));
    }
    return response.json();
  });
}

export function fetchSendMessage(text) {
  return fetch('/api/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({ text }),
  })
  .catch(err => Promise.reject({ error: 'network-error' }))
  .then(response => {
    if (!response.ok) {
      return response.json().then(err => Promise.reject(err));
    }
    return response.json();
  });
}

export function fetchUsers() {
  return fetch('/api/v1/users')
  .catch(err => Promise.reject({ error: 'network-error' }))
  .then(response => {
    if (!response.ok) {
      return response.json().then(err => Promise.reject(err));
    }
    return response.json();
  });
}