import { RequestHandler } from 'express';
import {
    generateBracketEvents,
    getEventById,
    updateEvent
} from './events.services';
import { setFailureResponse, setSuccessResponse } from '../helpers/response';
import { PaginationRequestQueryModel, StandardResponse } from '../helpers/types';
import { Event } from './events.schema';
import { User } from '../users/users.schema';

export const generateBracketEventsHandler: RequestHandler<{ tournamentId: string }, StandardResponse<number>, undefined, undefined> = async (req, res, nxt) => {
    try {
        const result = await generateBracketEvents(req.token, req.params.tournamentId);
        setSuccessResponse(res, result);
    } catch (error) {
        console.log(error);
        nxt(error);
    }
}

export const getEventByIdHandler: RequestHandler<{ tournamentId: string, eventId: string }, StandardResponse<number>, { email: string }, undefined> = async (req, res, nxt) => {
    try {
        const result = await getEventById(req.params.tournamentId, req.params.eventId);
        setSuccessResponse(res, result);
    } catch (error) {
        nxt(error);
    }
}

export const updateEventHandler: RequestHandler<{ tournamentId: string, eventId: string }, StandardResponse<number>, Event, undefined> = async (req, res, nxt) => {
    try {
        const result = await updateEvent(req.params.tournamentId, req.params.eventId, req.body);
        setSuccessResponse(res, result);
    } catch (error) {
        nxt(error);
    }
}