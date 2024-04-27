import { error } from "console";
import { PARTICIPANT_STATUS_ENUM } from "../participants/participants.types";
import { getTournamentById } from "../tournaments/tournaments.services";
import { ErrorWithStatus, TokenModel } from "../helpers/types";
import { TOURNAMENT_STATUS_ENUM } from "../tournaments/tournaments.types";
import { Event, EventPlayer } from "./events.schema";
import { EVENT_STATUS, EVENT_TEAM_RESULT } from "./events.types";
import mongoose from "mongoose";
import { TournamentModel } from "../tournaments/tournaments.schema";
import { getUserById } from "../users/users.services";

export const generateBracketEvents = async (
    userInfo: TokenModel, tournamentId: string) => {
    const theTournament = await getTournamentById(tournamentId);

    if (!theTournament) throw new ErrorWithStatus("Tournament not found!", 200);

    const participantsCount = theTournament.participants.length;
    const totalRounds = Math.log2(participantsCount);

    if (theTournament.status !== TOURNAMENT_STATUS_ENUM.UPCOMING)
        throw new ErrorWithStatus(
            "Tournament's current state doesn't support this action!",
            200
        );

    if (totalRounds % 1 != 0)
        throw new ErrorWithStatus("Invalid number of participants", 200);

    const playingParticipants = theTournament.participants.filter(
        (p) => p.status === PARTICIPANT_STATUS_ENUM.PLAYING
    );

    const randomPlayersList = playingParticipants
        .map(value => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value);

    let theEvents: Array<Event> = [];
    const createdBy = {
        _id: userInfo._id,
        name: {
            first: userInfo.firstName,
            last: userInfo.lastName,
        },
        email: userInfo.email
    };

    let curUserIndex = 0;
    for (let i = 1; i <= totalRounds; i++) {
        let noOfEvents = Math.pow(2, totalRounds - i + 1) / 2;
        for (let j = 0; j < noOfEvents; j++) {
            console.log('j index: ', curUserIndex);
            console.log('j index: ', curUserIndex + 1);
            theEvents.push({
                _id: new mongoose.Types.ObjectId(),
                tournament_id: new mongoose.Types.ObjectId(),
                status: EVENT_STATUS.SCHEDULED,
                start_date: new Date(),
                end_date: new Date(),
                teams: [
                    {
                        status: EVENT_TEAM_RESULT.UNDECIDED,
                        players: i == 1 ? [randomPlayersList[curUserIndex]] : [],
                        created_by: createdBy
                    },
                    {
                        status: EVENT_TEAM_RESULT.UNDECIDED,
                        players: i == 1 ? [randomPlayersList[curUserIndex + 1]] : [],
                        created_by: createdBy
                    }
                ],
                round_number: i,
                parent_event_id: null//new mongoose.Types.ObjectId()
            });
            curUserIndex += 2;
        }
    }

    for (let i = 1; i <= totalRounds; i++) {
        let curRoundEvents = <Event[]>theEvents.filter(te => te.round_number == i);
        let nextRoundEvents = <Event[]>theEvents.filter(te => te.round_number == i + 1);

        let childIndexCounter = 0;
        for (let j = 0; j < nextRoundEvents.length; j++) {
            let parentId = nextRoundEvents[j]._id;
            let firstChildIndex = childIndexCounter;
            let secondChildIndex = childIndexCounter + 1;

            curRoundEvents[firstChildIndex].parent_event_id = parentId;
            curRoundEvents[secondChildIndex].parent_event_id = parentId;
            childIndexCounter += 2;
        }
        theEvents = theEvents.map(e => {
            let curRoundFind = curRoundEvents.find(re => re._id.toString() == e._id.toString());
            let nextRoundFind = nextRoundEvents.find(re => re._id.toString() == e._id.toString());

            if (curRoundFind)
                return curRoundFind;
            else if (nextRoundFind)
                return nextRoundFind;
            else return e;
        });
    }

    theEvents.push({
        tournament_id: new mongoose.Types.ObjectId(tournamentId),
        status: EVENT_STATUS.SCHEDULED,
        start_date: new Date(),
        end_date: new Date(),
        teams: [
            {
                status: EVENT_TEAM_RESULT.UNDECIDED,
                players: [],
                created_by: createdBy
            },
            {
                status: EVENT_TEAM_RESULT.UNDECIDED,
                players: [],
                created_by: createdBy
            }
        ],
        round_number: totalRounds + 1
    });

    const result = await TournamentModel.updateOne(
        { _id: tournamentId },
        { $set: { events: theEvents } }
    );

    return result.modifiedCount;
};

export const getEventById = async (tournamentId: string, eventId: string): Promise<Event> => {
    const result = await TournamentModel.aggregate([
        { $match: { '_id': new mongoose.Types.ObjectId(tournamentId) } },
        { $unwind: '$events' },
        { $match: { 'events._id': new mongoose.Types.ObjectId(eventId) } },
        { $project: { '_id': 0, 'events': 1 } }
    ]);
    return result[0].events;
};

export const updateEvent = async (tournamentId: string, eventId: string, event: Event) => {
    const result = await TournamentModel.updateOne(
        { _id: tournamentId, 'events._id': eventId },
        {
            $set: {
                'events.$.status': event.status,
                'events.$.teams': event.teams,
                'events.$.start_date': event.start_date,
                'events.$.end_date': event.end_date,
                'events.$.score': event.score
            }
        });

    if (event.status === EVENT_STATUS.ENDED && event.parent_event_id) {
        const parentResult = await getEventById(tournamentId, event.parent_event_id.toString());
        console.log('curEventId', eventId);
        console.log('parentResult', parentResult);
        const winningTeam = event.teams?.find(t => t.status === EVENT_TEAM_RESULT.WON);
        if (parentResult && winningTeam && parentResult.teams) {
            let curTeams = parentResult.teams.filter(t => t.players && t.players.length > 0);
            if (curTeams.length > 2) {
                throw new Error('Next event already has two teams!');
            }

            winningTeam.status = EVENT_TEAM_RESULT.UNDECIDED;
            curTeams.push(winningTeam);

            await TournamentModel.updateOne(
                { _id: tournamentId, 'events._id': event.parent_event_id },
                {
                    $set: {
                        'events.$.teams': curTeams
                    }
                });
        }
    }

    return result.modifiedCount;
};
