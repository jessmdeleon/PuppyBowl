// Use the API_URL variable to make fetch requests to the API.
// Replace the placeholder with your cohort name (ex: 2109-UNF-HY-WEB-PT)
const cohortName = "2402-FTB-MT-WEB-PT";
const API_URL = `https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}`;

/**
 * Fetches all players from the API.
 * @returns {Object[]} the array of player objects
 */
const fetchAllPlayers = async () => {
  try {
    const response = await fetch(`${API_URL}/players`);
    if (!response.ok) {
      throw new Error('Failed to fetch all players');
    }
    const data = await response.json();
    return data.players; // Assuming the API response contains a 'players' array
  } catch (err) {
    console.error('Uh oh, trouble fetching all players!', err);
    throw err;
  }
};

/**
 * Fetches a single player from the API.
 * @param {number} playerId
 * @returns {Object} the player object
 */
const fetchSinglePlayer = async (playerId) => {
  try {
    const response = await fetch(`${API_URL}/players/${playerId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch player #${playerId}`);
    }
    const data = await response.json();
    return data.player; // Assuming the API response contains a 'player' object
  } catch (err) {
    console.error(`Oh no, trouble fetching player #${playerId}!`, err);
    throw err;
  }
};

/**
 * Adds a new player to the roster via the API.
 * @param {Object} playerObj the player to add
 * @returns {Object} the player returned by the API
 */
const addNewPlayer = async (playerObj) => {
  try {
    const response = await fetch(`${API_URL}/players`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(playerObj),
    });
    if (!response.ok) {
      throw new Error('Failed to add new player');
    }
    const data = await response.json();
    return data; // Assuming data contains the newly added player object
  } catch (err) {
    console.error("Oops, something went wrong with adding that player!", err);
    throw err;
  }
};


/**
 * Removes a player from the roster via the API.
 * @param {number} playerId the ID of the player to remove
 */
const removePlayer = async (playerId) => {
  try {
    const response = await fetch(`${API_URL}/players/${playerId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`Failed to remove player #${playerId}`);
    }
  } catch (err) {
    console.error(
      `Whoops, trouble removing player #${playerId} from the roster!`,
      err
    );
    throw err;
  }
};

/**
 * Updates `<main>` to display a list of all players.
 *
 * If there are no players, a corresponding message is displayed instead.
 *
 * Each player is displayed in a card with the following information:
 * - name
 * - id
 * - image (with alt text of the player's name)
 *
 * Additionally, each card has two buttons:
 * - "See details" button that, when clicked, calls `renderSinglePlayer` to
 *    display more information about the player
 * - "Remove from roster" button that, when clicked, will call `removePlayer` to
 *    remove that specific player and then re-render all players
 *
 * Note: this function should replace the current contents of `<main>`, not append to it.
 * @param {Object[]} playerList - an array of player objects
 */
const renderAllPlayers = (playerList) => {
  const mainElement = document.querySelector('main');
  mainElement.innerHTML = ''; // Clear existing content
  if (playerList.length === 0) {
    mainElement.innerHTML = '<p>No players available</p>';
  } else {
    const playerCards = playerList.map(player => `
      <div class="player-card">
        <h2>${player.name}</h2>
        <p>ID: ${player.id}</p>
        <img src="${player.imageUrl}" alt="${player.name}">
        <button class="details-btn" data-player-id="${player.id}">See Details</button>
        <button class="remove-btn" data-player-id="${player.id}">Remove from Roster</button>
      </div>
    `).join('');
    mainElement.innerHTML = playerCards;
  }
};


/**
 * Updates `<main>` to display a single player.
 * The player is displayed in a card with the following information:
 * - name
 * - id
 * - breed
 * - image (with alt text of the player's name)
 * - team name, if the player has one, or "Unassigned"
 *
 * The card also contains a "Back to all players" button that, when clicked,
 * will call `renderAllPlayers` to re-render the full list of players.
 * @param {Object} player an object representing a single player
 */
const renderSinglePlayer = (player) => {
  const mainElement = document.querySelector('main');
  mainElement.innerHTML = `
    <div class="player-card">
      <h2>${player.name}</h2>
      <p>ID: ${player.id}</p>
      <p>Breed: ${player.breed}</p>
      <img src="${player.imageUrl}" alt="${player.name}">
      <p>Team: ${player.team ? player.team : 'Unassigned'}</p>
      <button class="back-btn">Back to All Players</button>
    </div>
  `;
};


/**
 * Fills in `<form id="new-player-form">` with the appropriate inputs and a submit button.
 * When the form is submitted, it should call `addNewPlayer`, fetch all players,
 * and then render all players to the DOM.
 */
const renderNewPlayerForm = () => {
  const mainElement = document.querySelector('main');
  mainElement.innerHTML = `
    <form id="new-player-form">
      <label for="name">Name:</label>
      <input type="text" id="name" name="name">
      <label for="breed">Breed:</label>
      <input type="text" id="breed" name="breed">
      <button type="submit">Add New Player</button>
    </form>
  `;
  const formElement = document.getElementById('new-player-form');
  formElement.addEventListener('submit', async (event) => {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const breed = document.getElementById('breed').value;
    try {
      const newPlayer = await addNewPlayer({ name, breed });
      const updatedPlayerList = await fetchAllPlayers();
      renderAllPlayers(updatedPlayerList);
    } catch (error) {
      console.error('Error adding new player:', error);
    }
  });
};


/**
 * Initializes the app by fetching all players and rendering them to the DOM.
 */
const init = async () => {
  const players = await fetchAllPlayers();
  renderAllPlayers(players);

  renderNewPlayerForm();
};

// This script will be run using Node when testing, so here we're doing a quick
// check to see if we're in Node or the browser, and exporting the functions
// we want to test if we're in Node.
if (typeof window === "undefined") {
  module.exports = {
    fetchAllPlayers,
    fetchSinglePlayer,
    addNewPlayer,
    removePlayer,
    renderAllPlayers,
    renderSinglePlayer,
    renderNewPlayerForm,
  };
} else {
  init();
}