import express, { json } from "express";
import {
   generateBracketEventsHandler,
   getEventByIdHandler,
   updateEventHandler
} from "./events.handlers";

const router = express.Router({ mergeParams: true });

router.post('/generate-bracket-events', json(), generateBracketEventsHandler);
router.get('/:eventId', getEventByIdHandler);
router.patch('/:eventId', json(), updateEventHandler);

export default router;