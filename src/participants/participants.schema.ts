import mongoose, { Schema, InferSchemaType } from 'mongoose';
import { PARTICIPANT_STATUS_ENUM } from './participants.types';

export const participantSchema = new Schema({
    _id: mongoose.Types.ObjectId,
    name: {
        first: { type: String },
        last: { type: String }
    },
    email: { type: String },
    phone: { type: String },
    profile_picture: { type: String },
    status: { type: String, enum: PARTICIPANT_STATUS_ENUM, default: PARTICIPANT_STATUS_ENUM.PLAYING }
});
export type Participant = InferSchemaType<typeof participantSchema>;