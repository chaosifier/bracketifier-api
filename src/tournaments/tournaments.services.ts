import mongoose from "mongoose";
import { connect } from "../helpers/db";
import {
  TOURNAMENT_STATUS_ENUM,
  TournamentCreateUpdateRequestModel,
} from "./tournaments.types";
import { Tournament, TournamentModel } from "./tournaments.schema";
import { PaginationRequestQueryModel, TokenModel } from "../helpers/types";

export const createTournament = async (
  userInfo: TokenModel,
  data: TournamentCreateUpdateRequestModel
) => {
  console.log(`new tournament data -------> `, data);
  const result = await TournamentModel.create({
    title: data.title,
    description: data.description,
    start_date: data.start_date,
    end_date: data.end_date,
    max_participants: data.max_participants,
    type: data.type,
    created_by: {
      _id: userInfo._id,
      name: {
        first: userInfo.firstName,
        last: userInfo.lastName,
      },
      email: userInfo.email,
    },
  });

  return result._id;
};

export const getMyTournaments = async (
  userInfo: TokenModel,
  filter: PaginationRequestQueryModel
) => {
  const result = await TournamentModel.find({ "created_by._id": userInfo._id })
    .skip((filter.pageNumber - 1) * filter.pageSize)
    .limit(filter.pageSize);
  return result;
};

export const getTournamentById = async (tournamentId: string) : Promise<Tournament | null> => {
  const result = await TournamentModel.findOne({
    _id: tournamentId,
  });
  return result;
};

// TODO: add jwt userid validation
export const updateTournament = async (
  userInfo: TokenModel,
  tournamentId: string,
  data: TournamentCreateUpdateRequestModel
) => {
  const result = await TournamentModel.updateOne(
    { _id: tournamentId, "created_by._id": userInfo._id },
    {
      $set: {
        title: data.title,
        description: data.description,
        start_date: data.start_date,
        end_date: data.end_date,
        max_participants: data.max_participants,
        type: data.type,
      },
    }
  );

  return result.modifiedCount;
};

export const deleteTournament = async (
  userInfo: TokenModel,
  tournamentId: string
) => {
  const result = await TournamentModel.deleteOne({
    _id: tournamentId,
    "created_by._id": userInfo._id,
  });

  return result.deletedCount;
};
