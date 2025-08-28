# Wallet-Based Authentication Implementation Guide

This document explains how to implement and use the wallet-based authentication system for Grind-Core RPG.

## Overview

The authentication system uses Solana wallet signatures to verify user identity without requiring traditional usernames/passwords. Users connect their wallet, sign a challenge message, and receive a JWT token for subsequent API calls.

## Architecture

### Backend Components

1. **Authentication Middleware** (`backend/middleware/authMiddleware.ts`)

   - Verifies JWT tokens
   - Extracts wallet addresses from authenticated requests
   - Provides optional authentication for public routes

2. **Authentication Controller** (`backend/controllers/authController.ts`)

   - Generates nonces for wallet challenges
   - Verifies wallet signatures
   - Creates/updates player accounts
   - Issues JWT tokens

3. **Authentication Routes** (`backend/routes/authRoutes.ts`)

   - `/api/auth/nonce` - Get challenge message
   - `/api/auth/authenticate` - Verify signature and get token
   - `/api/auth/disconnect` - Disconnect wallet

4. **Updated Player Middleware** (`backend/middleware/playerMiddleware.ts`)
   - Now requires authentication
   - Finds players by wallet address instead of hardcoded ID

### Frontend Components

1. **Wallet Authentication Service** (`services/walletAuthService.ts`)

   - Handles API communication for auth
   - Manages JWT tokens and wallet addresses
   - Provides authentication headers for API calls

2. **Wallet Authentication Hook** (`hooks/useWalletAuth.ts`)
   - React hook for managing auth state
   - Provides connect/disconnect methods
   - Handles loading and error states

## Installation

### Backend Dependencies

Install the required packages:

```bash
cd backend
npm install jsonwebtoken @solana/web3.js bs58
npm install --save-dev @types/jsonwebtoken
```

### Environment Variables

Add to your `.env` file:

```env
JWT_SECRET=your-super-secret-jwt-key-here
```

## Usage

### 1. Frontend Wallet Connection

```tsx
import { useWalletAuth } from "../hooks/useWalletAuth";

const MyComponent = () => {
  const {
    isAuthenticated,
    walletAddress,
    player,
    isLoading,
    error,
    connectWallet,
    disconnectWallet,
  } = useWalletAuth();

  const handleConnect = async () => {
    try {
      // Get wallet address from Solana wallet
      const wallet = window.solana; // or your wallet adapter
      const address = wallet.publicKey.toString();

      // Get nonce from server
      const nonceResponse = await fetch("/api/auth/nonce", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ walletAddress: address }),
      });
      const { message } = await nonceResponse.json();

      // Sign message with wallet
      const signature = await wallet.signMessage(
        new TextEncoder().encode(message)
      );

      // Authenticate with server
      await connectWallet(address, signature, message);
    } catch (error) {
      console.error("Connection failed:", error);
    }
  };

  if (isLoading) return <div>Loading...</div>;

  if (isAuthenticated) {
    return (
      <div>
        <p>Connected: {walletAddress}</p>
        <p>Level: {player?.level}</p>
        <button onClick={disconnectWallet}>Disconnect</button>
      </div>
    );
  }

  return (
    <div>
      <button onClick={handleConnect}>Connect Wallet</button>
      {error && <p>Error: {error}</p>}
    </div>
  );
};
```

### 2. API Service Integration

The `apiService` automatically includes authentication headers for all requests when a user is connected:

```tsx
import { apiService } from "../services/apiService";

// This will automatically include the Authorization header
const player = await apiService.getPlayer();
```

### 3. Protected Routes

All existing routes now require authentication. The middleware automatically:

- Verifies JWT tokens
- Finds players by wallet address
- Attaches player data to requests

## Security Features

### 1. Nonce-Based Challenge

- Each authentication attempt uses a unique, time-limited nonce
- Prevents replay attacks
- Nonces expire after 5 minutes

### 2. Signature Verification

- Wallet signs a specific challenge message
- Server verifies signature matches wallet address
- Prevents impersonation attacks

### 3. JWT Tokens

- 24-hour expiration
- Contains wallet address and player ID
- Signed with server secret

### 4. Rate Limiting

- Consider implementing rate limiting on auth endpoints
- Prevent brute force attacks

## Database Changes

### Player Model Updates

The Player model now includes:

- `walletAddress`: Unique identifier for each player
- Indexed for fast lookups
- Sparse index allows for unconnected players

### Migration Strategy

For existing players:

1. Create a migration script to assign temporary wallet addresses
2. Or implement a fallback system for unauthenticated users
3. Consider implementing a "guest mode" for non-wallet users

## Production Considerations

### 1. Redis for Nonce Storage

Replace in-memory nonce storage with Redis:

```typescript
// Instead of Map<string, NonceData>
const nonce = await redis.setex(`nonce:${walletAddress}`, 300, nonce);
```

### 2. Proper Signature Verification

Implement full Solana signature verification:

```typescript
import { verify } from "@solana/web3.js";

const isValid = verify(new TextEncoder().encode(message), signature, publicKey);
```

### 3. Environment Security

- Use strong, unique JWT secrets
- Store secrets in environment variables
- Consider using a secrets management service

### 4. Monitoring

- Log authentication attempts
- Monitor for suspicious patterns
- Implement alerting for failed auth attempts

## Testing

### Backend Tests

```typescript
// Test authentication flow
describe("Authentication", () => {
  it("should generate nonce for wallet address", async () => {
    const response = await request(app)
      .post("/api/auth/nonce")
      .send({ walletAddress: "test-wallet-address" });

    expect(response.status).toBe(200);
    expect(response.body.nonce).toBeDefined();
  });
});
```

### Frontend Tests

```typescript
// Test wallet auth hook
describe("useWalletAuth", () => {
  it("should connect wallet successfully", async () => {
    const { result } = renderHook(() => useWalletAuth());

    await act(async () => {
      await result.current.connectWallet("address", "signature", "message");
    });

    expect(result.current.isAuthenticated).toBe(true);
  });
});
```

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure backend allows frontend origin
2. **JWT Expired**: Tokens expire after 24 hours, re-authenticate
3. **Signature Verification**: Ensure message format matches exactly
4. **Database Connection**: Check MongoDB connection and indexes

### Debug Mode

Enable debug logging in auth middleware:

```typescript
console.log("Auth attempt:", { walletAddress, hasToken: !!token });
```

## Next Steps

1. **Implement Solana Wallet Adapter**: Use official Solana wallet adapter for better UX
2. **Add NFT Verification**: Check if wallet owns Reptilianz NFTs
3. **Implement Refresh Tokens**: Extend session duration
4. **Add Multi-Wallet Support**: Allow connecting multiple wallets to one account
5. **Implement Guest Mode**: Allow play without wallet connection

## Support

For questions or issues:

1. Check the authentication logs
2. Verify JWT token format
3. Ensure wallet signature matches challenge message
4. Check database indexes and connections
