# Grind Core Backend

Backend-only version of Grind Core RPG for deployment to Render, Railway, or other Node.js hosting services.

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Production

```bash
npm start
```

## Environment Variables

Make sure to set these environment variables in your hosting service:

- `MONGODB_URI`: Your MongoDB connection string
- `GEMINI_API_KEY`: Your Gemini API key for AI features
- `JWT_SECRET`: Secret for JWT token signing
- `PORT`: Port to run the server on (default: 5001)

## Deploy to Render

1. Connect your GitHub repo
2. Set build command: `npm install`
3. Set start command: `npm start`
4. Add environment variables

## Note

This is the backend-only version. The frontend runs separately and needs to be deployed to Vercel or another frontend hosting service.
# grind-core-frontend
