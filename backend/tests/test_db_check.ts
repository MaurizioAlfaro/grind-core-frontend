import connectDB from "../config/db";
import mongoose from "mongoose";
import PlayerModel from "../models/playerModel";

async function checkDatabase() {
  try {
    console.log("🔌 Connecting to database...");
    await connectDB();
    console.log("✅ Database connected");

    // Check if there are any existing players
    const players = await PlayerModel.find({}).limit(5);
    console.log(`Found ${players.length} players in database`);

    if (players.length > 0) {
      console.log("First player structure:");
      console.log(JSON.stringify(players[0].toObject(), null, 2));
    }

    // Check the collection structure
    const collections = await mongoose.connection.db
      .listCollections()
      .toArray();
    console.log("Collections in database:");
    collections.forEach((col) => {
      console.log(`- ${col.name}`);
    });

    // Check indexes on players collection
    const indexes = await PlayerModel.collection.indexes();
    console.log("Indexes on players collection:");
    indexes.forEach((index) => {
      console.log(`- ${JSON.stringify(index)}`);
    });
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await mongoose.disconnect();
    console.log("✅ Database disconnected");
  }
}

checkDatabase();
