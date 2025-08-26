const mongoose = require("mongoose");
require("dotenv").config();

// Connect to MongoDB
mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost:27017/grind-core",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

// Import the Player model
const Player = require("./models/playerModel");

async function disableTutorialForAllPlayers() {
  try {
    console.log("Connecting to database...");
    await mongoose.connection.asPromise();
    console.log("Connected to database");

    // Find all players and update their tutorial state
    const result = await Player.updateMany(
      {}, // Update all players
      {
        $set: {
          tutorialStep: 99,
          tutorialCompleted: true,
        },
      }
    );

    console.log(`Updated ${result.modifiedCount} players`);
    console.log("Tutorial has been disabled for all players");

    // Verify the update
    const players = await Player.find({});
    console.log("\nVerification:");
    players.forEach((player) => {
      console.log(
        `Player ${player._id}: tutorialStep=${player.tutorialStep}, tutorialCompleted=${player.tutorialCompleted}`
      );
    });
  } catch (error) {
    console.error("Error updating players:", error);
  } finally {
    await mongoose.connection.close();
    console.log("Database connection closed");
  }
}

// Run the function
disableTutorialForAllPlayers();
