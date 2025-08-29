import mongoose, { Schema, Document } from "mongoose";

export interface IChatMessage extends Document {
  userId: mongoose.Types.ObjectId;
  username: string;
  avatar: string;
  text: string;
  timestamp: Date;
  room: string;
}

const chatMessageSchema = new Schema<IChatMessage>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "Player",
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
    maxlength: 500,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  room: {
    type: String,
    default: "main",
  },
});

// Index for efficient querying
chatMessageSchema.index({ room: 1, timestamp: -1 });
chatMessageSchema.index({ userId: 1 });

export const ChatMessage = mongoose.model<IChatMessage>(
  "ChatMessage",
  chatMessageSchema
);
