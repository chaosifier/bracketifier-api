import express, { json } from "express";
import {
    getMyTournamentsHandler,
    getTournamentByIdHandler,
    createTournamentHandler,
    updateTournamentHandler,
    deleteTournamentHandler
} from "./tournaments.handlers";
import participantsRouter from "../participants/participants.routes";
import eventsRouter from "../events/events.routes";

const router = express.Router();

router.get('/manage', getMyTournamentsHandler);
router.patch('/:tournamentId', json(), updateTournamentHandler);
router.get('/:tournamentId', getTournamentByIdHandler);
router.post('/', json(), createTournamentHandler);
router.delete('/:tournamentId', deleteTournamentHandler);

router.use('/:tournamentId/participants', participantsRouter);
router.use('/:tournamentId/events', eventsRouter);

export default router;