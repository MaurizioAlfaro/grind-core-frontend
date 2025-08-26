# Disable Tutorial for Existing Players

The tutorial has been disabled by default for new players in the backend. However, if you have existing players in your database that still have the tutorial enabled, you can run the following script to update them.

## Option 1: Run the Database Update Script

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Run the disable tutorial script:
   ```bash
   node disableTutorial.js
   ```

This script will:

- Connect to your MongoDB database
- Update all existing players to have `tutorialStep: 99` and `tutorialCompleted: true`
- Verify the changes were applied
- Close the database connection

## Option 2: Use the API Endpoint

If you prefer to use the API, you can make a POST request to `/player/tutorial` with:

```json
{
  "tutorialStep": 99,
  "tutorialCompleted": true
}
```

## What Was Changed

The following files were modified to disable the tutorial:

1. **`backend/models/playerModel.ts`** - Set default values to `tutorialStep: 99` and `tutorialCompleted: true`
2. **`constants/player.ts`** - Updated `INITIAL_PLAYER_STATE` to have tutorial disabled
3. **`backend/controllers/playerController.ts`** - Modified validation to allow step 99
4. **`constants/devStates.ts`** - Already had `completedTutorialState` with step 99

## Verification

After running the script, all players should have:

- `tutorialStep: 99`
- `tutorialCompleted: true`

This means the tutorial will not appear for any players, and they can access all game features immediately.
