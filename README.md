# Grind-Core RPG

This is a mobile-first, single-avatar idle/looter RPG. This version has been refactored into a full client-server application with a Node.js/Express backend and MongoDB database persistence.

## Project Structure

- **`/` (root):** Contains the main `index.html` and frontend source files.
- **`/backend`:** Contains the complete Node.js/Express/TypeScript backend server.

## How to Run

You will need to have [Node.js](https://nodejs.org/) installed on your machine.

### 1. Install Dependencies

First, install dependencies for both the root/client and the backend.

```bash
# Navigate to the project root directory
# Install client dependencies (like concurrently)
npm install

# Navigate to the backend directory
cd backend

# Install server dependencies (express, mongoose, etc.)
npm install
```

### 2. Start the Application

Everything is configured to run with a single command from the **root directory**.

```bash
# From the project's root directory
npm run dev
```

This command will concurrently:
- Start the backend server on `http://localhost:5001`.
- Start the frontend development server (using Vite) on `http://localhost:5173`.

Your browser should automatically open to the game.

## Backend Details

- The backend server code is located in the `/backend` directory.
- It uses an `.env` file to store the MongoDB connection string. This has been pre-configured for you.
- It does **not** have a user authentication system. For simplicity, it automatically creates and uses a single player document in the database, simulating a logged-in user.

## Frontend Details

- The frontend code lives in the root directory.
- The `useRealBackEnd` flag has been permanently enabled.
- All game actions are now handled through network requests to the backend server via `services/apiService.ts`.
- Local storage is no longer used for saving game state.
