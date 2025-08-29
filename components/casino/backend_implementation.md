# Backend Implementation Analysis & Proposal

## 1. Current State: Fully Mocked Backend

An analysis of the `mockApi` directory confirms that the application's backend is **fully simulated on the client-side**.

- **Data Persistence:** `localStorage` is used as a stand-in for a database (`mockApi/database.ts`). This means all game state (chips, deck state, settings) is stored directly in the user's browser.
- **API Simulation:** The functions within the `mockApi/routes/` and `mockApi/controllers/` directories mimic a server's API endpoints and business logic.
- **Network Latency:** The `apiRequest` function uses `setTimeout` to simulate the delay of a real network request, providing a more realistic user experience.

This approach is excellent for rapid prototyping and frontend development, but a production application would require moving this logic to a dedicated, authoritative server.

## 2. Proposal for a Real-World Backend Architecture

A scalable, secure, and multi-user backend would require the following components:

- **Web Server:** An application server (e.g., built with Node.js/Express, Go, Python/Django) to handle API requests.
- **Database:** A robust database (e.g., PostgreSQL for relational data or MongoDB for NoSQL) to store user accounts, chip balances, game history, and settings.
- **Authentication:** A secure method for managing user sessions, like JSON Web Tokens (JWT). The server would issue a token upon login, which the client would include in the `Authorization` header of subsequent requests.
- **Real-time Communication:** For the chat feature, a WebSocket server is strongly recommended over traditional HTTP requests to enable instant, bidirectional communication.

## 3. Proposed REST API Endpoints

The following RESTful endpoints would replace the current mocked functions. All routes should be protected and require an authentication token.

---

### Blackjack (`/api/blackjack`)

The server will manage the entire game state, including the deck, hands, and bets.

- **`GET /state`**: Initializes a new game or retrieves the existing game state for the authenticated user.
- **`POST /settings`**: Updates the game settings.
  - **Body**: `GameSettings` object.
- **`POST /bet`**: Places the main bet for a round.
  - **Body**: `{ "amount": 50 }`
- **`POST /deal`**: Starts a new round, dealing cards to the player and dealer.
- **`POST /action`**: The primary endpoint for in-game decisions.
  - **Body**: `{ "action": "hit" | "stand" | "double" | "split" | "surrender" }`
- **`POST /insurance`**: Responds to an insurance offer.
  - **Body**: `{ "accepted": true }`
- **`POST /next-round`**: Cleans up the previous round and prepares for a new betting phase.

---

### Baccarat (`/api/baccarat`)

- **`GET /state`**: Retrieves the current game state.
- **`POST /settings`**: Updates Baccarat game settings.
  - **Body**: `BaccaratSettings` object.
- **`POST /bet`**: Places one or more bets on the table.
  - **Body**: `{ "bets": { "player": 50, "tie": 10 } }`
- **`POST /bet/clear`**: Clears all current bets from the table.
- **`POST /bet/repeat`**: Re-applies the bets from the previous round.
- **`POST /deal`**: Starts the deal, runs the third-card logic automatically, and returns the final result.
- **`POST /next-round`**: Moves to the next round.

---

### Roulette (`/api/roulette`)

- **`GET /state`**: Retrieves the current Roulette game state.
- **`POST /settings`**: Updates Roulette game settings.
  - **Body**: `RouletteSettings` object.
- **`POST /bet`**: Places one or more bets.
  - **Body**: `{ "bets": { "straight_10": 5, "red": 25 } }`
- **`POST /bet/clear`**: Clears all bets.
- **`POST /bet/repeat`**: Repeats the last bet configuration.
- **`POST /spin`**: Initiates the wheel spin. The server determines the winning number and returns it. The server handles all payout calculations.
  - **Response**: The final `RouletteState` including the winning number and updated chip count.
- **`POST /next-round`**: Resets the table for the next round of betting.

---

### Chat (`/api/chat` & WebSockets)

A hybrid approach is best for chat. Use a REST endpoint to fetch initial history and WebSockets for real-time messages.

- **`GET /history`**: Retrieves the last 50 messages in the chat room.

**WebSocket Communication (`ws://your-server.com/chat`)**

- **Client Connects:** The client establishes a WebSocket connection after loading the chat tab.
- **Client Sends Message:**
  - **Event**: `sendMessage`
  - **Payload**: `{ "text": "Hello everyone!" }`
- **Server Broadcasts Message:** The server receives the message, attaches user info, and broadcasts it to all connected clients.
  - **Event**: `newMessage`
  - **Payload**: `ChatMessage` object (including user ID, name, avatar, text, timestamp).
