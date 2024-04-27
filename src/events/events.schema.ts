import mongoose, { Schema, model, InferSchemaType } from 'mongoose';
import { EVENT_STATUS, EVENT_TEAM_RESULT } from './events.types';

const eventPlayerSchema = new Schema(
    {
        name: {
            first: { type: String, required: true },
            last: { type: String, required: true },
        },
        email: { type: String, unique: true, required: true },
        phone: { type: String, unique: true, required: true },
        profile_picture: { type: String, required: false }
    },
    { versionKey: false }
);

export const eventSchema = new Schema(
    {
        _id: { type: mongoose.Schema.Types.ObjectId, required: true },
        tournament_id: { type: mongoose.Schema.Types.ObjectId, required: true },
        status: { type: String, enum: EVENT_STATUS, default: EVENT_STATUS.SCHEDULED },
        start_date: { type: Date, required: true },
        end_date: { type: Date, required: true },
        teams: {
            type: [{
                status: { type: String, enum: EVENT_TEAM_RESULT, default: EVENT_TEAM_RESULT.UNDECIDED },
                players: { type: [eventPlayerSchema], default: [], required: false }
            }], default: undefined
        },
        round_number: { type: Number, required: true },
        score: [],
        parent_event_id: { type: mongoose.Schema.Types.ObjectId, required: false },
    },
    { versionKey: false }
);
export type Event = InferSchemaType<typeof eventSchema>;
export type EventPlayer = InferSchemaType<typeof eventPlayerSchema>;
// export const EventModel = model<Event>('event', eventSchema);