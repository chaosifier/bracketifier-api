import express, { json } from "express";
import {
    addExistingUserAsParticipantHandler,
    addNewUserAsParticipantHandler,
    deleteParticipantHandler,
    updateParticipantStatusHandler
} from "./participants.handlers";

const router = express.Router({ mergeParams: true });

router.post('/', json(), addNewUserAsParticipantHandler);
router.post('/add-existing', json(), addExistingUserAsParticipantHandler);
router.patch('/update-status', json(), updateParticipantStatusHandler);
router.delete('/:userId', deleteParticipantHandler);

export default router;