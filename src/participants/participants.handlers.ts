import { RequestHandler } from 'express';
import {
    addExistingUserAsParticipant,
    addNewUserAsParticipant,
    removeParticipant,
    updateParticipantStatus
} from './participants.services';
import { setFailureResponse, setSuccessResponse } from '../helpers/response';
import { PaginationRequestQueryModel, StandardResponse } from '../helpers/types';
import { Participant } from './participants.schema';
import { User } from '../users/users.schema';
import { PARTICIPANT_STATUS_ENUM } from './participants.types';

export const addNewUserAsParticipantHandler: RequestHandler<{ tournamentId: string }, StandardResponse<number>, User, undefined> = async (req, res, nxt) => {
    try {
        const result = await addNewUserAsParticipant(req.params.tournamentId, req.body);
        setSuccessResponse(res, result);
    } catch (error) {
        console.log(error);
        nxt(error);
    }
}

export const addExistingUserAsParticipantHandler: RequestHandler<{ tournamentId: string }, StandardResponse<number>, { email: string }, undefined> = async (req, res, nxt) => {
    try {
        const result = await addExistingUserAsParticipant(req.params.tournamentId, req.body.email);
        setSuccessResponse(res, result);
    } catch (error) {
        nxt(error);
    }
}

export const updateParticipantStatusHandler: RequestHandler<{ tournamentId: string }, StandardResponse<number>, { userId: string, status: PARTICIPANT_STATUS_ENUM }, undefined> = async (req, res, nxt) => {
    try {
        const result = await updateParticipantStatus(req.params.tournamentId, req.body);
        setSuccessResponse(res, result);
    } catch (error) {
        nxt(error);
    }
}

export const deleteParticipantHandler: RequestHandler<{ tournamentId: string, userId: string }, StandardResponse<number>, undefined, undefined> = async (req, res, nxt) => {
    try {
        const result = await removeParticipant(req.params.tournamentId, req.params.userId);
        setSuccessResponse(res, result);
    } catch (error) {
        nxt(error);
    }
}