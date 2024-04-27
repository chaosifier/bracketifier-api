import mongoose, { Schema, model, InferSchemaType } from "mongoose";
import { participantSchema } from "../participants/participants.schema";
import { TOURNAMENT_STATUS_ENUM, TOURNAMENT_TYPE } from "./tournaments.types";
import { eventSchema } from "../events/events.schema";

const tournamentSchema = new Schema({
  title: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  start_date: { type: Date, required: true },
  end_date: { type: Date, required: true },
  max_participants: { type: Number, required: true },
  type: {
    type: String,
    enum: TOURNAMENT_TYPE,
    default: TOURNAMENT_TYPE.SINGLE_ELIMINATION,
  },
  created_by: {
    _id: mongoose.Types.ObjectId,
    name: {
      first: String,
      last: String,
    },
    email: String,
  },
  participants: [participantSchema],
  status: {
    type: String,
    enum: TOURNAMENT_STATUS_ENUM,
    default: TOURNAMENT_STATUS_ENUM.UPCOMING,
  },
  events: [eventSchema]
});
export type Tournament = InferSchemaType<typeof tournamentSchema>;
export const TournamentModel = model<Tournament>(
  "tournament",
  tournamentSchema
);
