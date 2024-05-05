const {
  fetchAllPlayers,
  fetchSinglePlayer,
  addNewPlayer,
  removePlayer,
  renderAllPlayers,
  renderSinglePlayer,
  renderNewPlayerForm,
} = require("./script");

describe('fetchAllPlayers', () => {
  test('returns an array', async () => {
    const players = await fetchAllPlayers();
    expect(Array.isArray(players)).toBe(true);
  });

  test('returns players with name and id', async () => {
    const players = await fetchAllPlayers();
    players.forEach((player) => {
      expect(player).toHaveProperty('name');
      expect(player).toHaveProperty('id');
    });
  });
});

// TODO: Tests for `fetchSinglePlayer`
describe('fetchSinglePlayer', () => {
  test('returns a single player object', async () => {
    const playerId = 1; // Assuming player with ID 1 exists
    const player = await fetchSinglePlayer(playerId);
    expect(player).toBeDefined();
    expect(player).toHaveProperty('name');
    expect(player).toHaveProperty('id', playerId);
  });

  test('returns undefined for non-existing player', async () => {
    const playerId = -1; // Assuming no player with ID -1 exists
    const player = await fetchSinglePlayer(playerId);
    expect(player).toBeUndefined();
  });
});



// TODO: Tests for `addNewPlayer`
describe("addNewPlayer", () => {
  test("adds a new player successfully", async () => {
    const newPlayer = { name: "TestPlayer", breed: "TestBreed" };
    const response = await addNewPlayer(newPlayer);
    expect(response).toBeDefined();
    expect(response.data.newPlayer).toHaveProperty("id");
    // Add more assertions based on the response if needed
  });

  test("throws an error for invalid player data", async () => {
    const newPlayer = { invalidKey: "InvalidValue" }; // Invalid player data
    await expect(addNewPlayer(newPlayer)).rejects.toThrow();
  });
});



// (Optional) TODO: Tests for `removePlayer`
describe("removePlayer", () => {
  test("removes an existing player successfully", async () => {
    const playerIdToRemove = 1; // Assuming player ID 1 exists and can be removed
    await removePlayer(playerIdToRemove);
    // Fetch all players and ensure the player is removed
    const playersAfterRemoval = await fetchAllPlayers();
    const removedPlayer = playersAfterRemoval.find((player) => player.id === playerIdToRemove);
    expect(removedPlayer).toBeUndefined();
  });

  test("throws an error for non-existing player", async () => {
    const playerIdToRemove = -1; // Assuming player ID -1 does not exist
    await expect(removePlayer(playerIdToRemove)).rejects.toThrow();
  });
});
