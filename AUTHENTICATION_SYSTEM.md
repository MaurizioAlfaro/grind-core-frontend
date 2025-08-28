# Authentication System Documentation

## Overview

The app now uses a JWT-based authentication system that supports both anonymous users and wallet-connected users. Each user gets a unique UUID and can optionally connect a Solana wallet.

## How It Works

### 1. User Creation

- When a new user visits the app, a new anonymous user account is automatically created
- A JWT token is generated with a 30-day expiration
- The token contains the user's UUID and walletId (initially null)

### 2. Authentication Flow

- JWT tokens are stored in localStorage under the key `grind_core_jwt`
- All API requests include the JWT token in the Authorization header
- If a token expires or becomes invalid, a new user account is created automatically

### 3. Wallet Connection

- Users can connect their Solana wallet (Phantom) to their account
- The wallet's public key is stored as the `walletId`
- A new JWT token is generated with the updated wallet information
- Users can disconnect their wallet, which sets `walletId` back to null

## Backend Changes

### New Files

- `backend/middleware/authMiddleware.ts` - JWT verification middleware
- `backend/routes/authRoutes.ts` - Authentication endpoints

### Updated Files

- `backend/models/playerModel.ts` - Added `uuid` and `walletId` fields
- `backend/middleware/playerMiddleware.ts` - Now works with JWT authentication
- All route files - Now use `authMiddleware` and `playerMiddleware`

### API Endpoints

#### POST `/api/auth/create`

Creates a new anonymous user and returns a JWT token.

#### POST `/api/auth/connect-wallet`

Connects or disconnects a wallet from an existing user.

- Body: `{ "walletId": "wallet_public_key" }` or `{ "walletId": "" }` to disconnect
- Requires valid JWT token

#### POST `/api/auth/refresh`

Refreshes the JWT token (extends expiration).

- Requires valid JWT token

## Frontend Changes

### Updated Files

- `services/apiService.ts` - Added authentication endpoints and JWT handling
- `hooks/useGameLoop.ts` - Updated initialization and wallet connection logic
- `types.ts` - Added Solana wallet types and new PlayerState fields

### New Features

- Automatic user creation on app load
- Real Solana wallet integration
- JWT token management
- Automatic token refresh

## Database Schema Changes

The Player model now includes:

```typescript
{
  uuid: String,           // Required, unique user identifier
  walletId: String,       // Optional Solana wallet public key
  // ... existing fields
}
```

## Security Features

- JWT tokens expire after 30 days
- All API routes require valid authentication
- Wallet connections are verified through the Solana network
- No sensitive data is stored in localStorage

## Migration

To migrate from the old single-player system:

1. Run the database cleanup script:

   ```bash
   cd backend
   node clearDatabase.js
   ```

2. The new system will automatically create user accounts for new visitors

## Environment Variables

Add to your `.env` file:

```
JWT_SECRET=your-secure-secret-key-here
```

## Testing

1. Start the backend server
2. Visit the frontend - a new user account should be created automatically
3. Check the browser's localStorage for the JWT token
4. Try connecting a Phantom wallet
5. Verify that the wallet connection persists across page reloads
