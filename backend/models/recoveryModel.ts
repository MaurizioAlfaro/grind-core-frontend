import mongoose, { Schema, Document } from "mongoose";

export interface IRecovery extends Document {
  playerId: mongoose.Types.ObjectId;
  recoveryString: string;
}

const RecoverySchema = new Schema<IRecovery>({
  playerId: {
    type: Schema.Types.ObjectId,
    ref: "Player",
    required: true,
    unique: true,
  },
  recoveryString: {
    type: String,
    required: true,
    unique: true,
  },
});

export const Recovery = mongoose.model<IRecovery>("Recovery", RecoverySchema);
