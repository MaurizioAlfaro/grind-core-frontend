import asyncHandler from 'express-async-handler';
import Player from '../models/playerModel';
import { INITIAL_PLAYER_STATE } from '../../constants/player';
import { recalculatePower } from '../logic/recalculatePower';

// A static ID for our single player. In a real app, this would come from a JWT.
const MOCK_PLAYER_ID = '66a01123456789abcdef1234'; 

// This middleware finds or creates the single player for the game.
// It simulates what a real authentication middleware would do: find a user/player
// and attach them to the request object.
export const playerMiddleware = asyncHandler(async (req: any, res, next) => {
    let player = await Player.findById(MOCK_PLAYER_ID);

    if (!player) {
        // If no player exists with this ID, create one.
        // This happens on the very first run.
        console.log("No player found, creating a new one...");
        const initialState = { 
            ...INITIAL_PLAYER_STATE,
            _id: MOCK_PLAYER_ID,
        };
        const hydratedState = recalculatePower(initialState);
        player = await Player.create(hydratedState);
        console.log("New player created.");
    }
    
    // Attach the mongoose document to the request object
    req.player = player;

    next();
});
