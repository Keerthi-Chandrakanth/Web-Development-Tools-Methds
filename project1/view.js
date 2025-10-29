function renderLoginPage(errorMessage = '') {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Login - Word Guess Game</title>
        <link rel="stylesheet" href="/style.css" />
      </head>
      <body>
        <h1>Welcome to the Word Guess Game</h1>
        ${errorMessage ? `<p class="error">${errorMessage}</p>` : ''}
        <form method="POST" action="/login">
          <label for="username">Enter your name:</label>
          <input type="text" id="username" name="username" required />
          <button type="submit">Login</button>
        </form>
      </body>
    </html>
  `;
}

function renderHomePage(username, gameData, allWords = [], leaderboard = []) {
  const { guesses, lastGuess, secret, gameOver } = gameData;

  let feedback = '';

  if (lastGuess) {
    if (lastGuess.type === 'invalid') {
      feedback = `<p class="error">"${lastGuess.word}" is not a valid word or already guessed. Try again.</p>`;
    } else if (lastGuess.type === 'correct') {
      feedback = `<p class="success">Congratulations! You guessed the correct word: "${secret}".</p>`;
    } else if (lastGuess.type === 'incorrect') {
      feedback = `<p class="info">"${lastGuess.word}" matched ${lastGuess.match} letter(s).</p>`;
    }
  }

  const guessListHtml = guesses.map((g) => `<li>${g}</li>`).join('');
  const wordsHtml = require('./words')
    .map((w) => `<span class="word-list__item">${w}</span>`)
    .join(' ');
   const leaderboardHtml = leaderboard.length
    ? leaderboard
        .map(
          ([name, score], i) =>
            `<li><strong>#${i + 1}</strong> ${name}: ${score} guess${score === 1 ? '' : 'es'}</li>`
        )
        .join('')
    : '<li>No scores yet!</li>';

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Game - ${username}</title>
        <link rel="stylesheet" href="/style.css" />
      </head>
        <body>
          <h1>Hello, ${username}!</h1>
          <h2>Leaderboard – Fewest Guesses</h2>
          <ol>
            ${leaderboardHtml}
          </ol>
          <h2>Available Words</h2>
          <div class="word-list">
            ${wordsHtml}
          </div>
          <h2>Your Guesses (${guesses.length})</h2>
          <ul class="guess-list">
            ${guessListHtml}
          </ul>
          ${feedback}
          ${
            !gameOver
              ? `
            <form method="POST" action="/guess">
              <label for="guess">Enter your guess:</label>
              <input type="text" id="guess" name="guess" required />
              <button type="submit">Submit Guess</button>
            </form>
          `
              : `
            <p>The game is over. You can start a new game below.</p>
          `
          }
          <form method="POST" action="/new-game">
            <button type="submit">Start New Game</button>
          </form>
          <form method="POST" action="/logout">
            <button type="submit">Logout</button>
          </form>
        </body>
    </html>
  `;
}

module.exports = {
  renderLoginPage,
  renderHomePage,
};
