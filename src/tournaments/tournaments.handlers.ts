import { RequestHandler } from 'express';
import {
    createTournament,
    updateTournament,
    deleteTournament,
    getMyTournaments,
    getTournamentById
} from './tournaments.services';
import { TournamentCreateUpdateRequestModel } from './tournaments.types';
import { setFailureResponse, setSuccessResponse } from '../helpers/response';
import { PaginationRequestQueryModel, StandardResponse } from '../helpers/types';
import { Tournament } from './tournaments.schema';

export const createTournamentHandler: RequestHandler<undefined, StandardResponse<string>, TournamentCreateUpdateRequestModel, undefined> = async (req, res, nxt) => {
    try {
        console.log('createTournamentHandler');
        console.log(req.token);
        const result = await createTournament(req.token, req.body);
        setSuccessResponse(res, result.toString());
    } catch (error) {
        nxt(error);
    }
}

export const updateTournamentHandler: RequestHandler<{ tournamentId: string }, StandardResponse<number>, TournamentCreateUpdateRequestModel, undefined> = async (req, res, nxt) => {
    try {
        const result = await updateTournament(req.token, req.params.tournamentId, req.body);
        setSuccessResponse(res, result);
    } catch (error) {
        nxt(error);
    }
}

export const deleteTournamentHandler: RequestHandler<{ tournamentId: string }, StandardResponse<number>, undefined, undefined> = async (req, res, nxt) => {
    try {
        const result = await deleteTournament(req.token, req.params.tournamentId);
        setSuccessResponse(res, result);
    } catch (error) {
        nxt(error);
    }
}

export const getMyTournamentsHandler: RequestHandler<undefined, StandardResponse<Tournament[]>, undefined, PaginationRequestQueryModel> = async (req, res, nxt) => {
    try {
        const result = await getMyTournaments(req.token, req.query);
        setSuccessResponse(res, result);
    } catch (error) {
        nxt(error);
    }
}

export const getTournamentByIdHandler: RequestHandler<{ tournamentId: string }, StandardResponse<Tournament>, undefined, undefined> = async (req, res, nxt) => {
    try {
        console.log('in');
        const result = await getTournamentById(req.params.tournamentId);

        if (result)
            setSuccessResponse(res, result);
        else
            setFailureResponse(res, 'Tournament not found!');
    } catch (error) {
        nxt(error);
    }
}