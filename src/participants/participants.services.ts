import mongoose from "mongoose";
import { PARTICIPANT_STATUS_ENUM } from "./participants.types";
import { Participant } from "./participants.schema";
import { TournamentModel } from "../tournaments/tournaments.schema";
import { PaginationRequestQueryModel } from "../helpers/types";
import { User, UserModel } from "../users/users.schema";
import { createUser, getUserById } from "../users/users.services";

export const addNewUserAsParticipant = async (
  tournamentId: string,
  data: User
) => {
  if (!data.password)
    data = {
      ...data,
      password: "1234a", //(Math.random() + 1).toString(36).substring(7); // email it to user
    };

  const user = await createUser(data);
  const result = await TournamentModel.updateOne(
    { _id: tournamentId },
    {
      $push: {
        participants: {
          _id: user._id,
          name: {
            first: data.name?.first,
            last: data.name?.last,
          },
          email: data.email,
          phone: data.phone,
          profile_picture: data.profile_picture,
        },
      },
    }
  );

  return result.modifiedCount;
};

export const addExistingUserAsParticipant = async (
  tournamentId: string,
  email: string
) => {
  const theUser = await getUserById(email);
  if (theUser) {
    const result = await TournamentModel.updateOne(
      { _id: tournamentId },
      {
        $push: {
          participants: {
            _id: theUser._id,
            name: {
              first: theUser.name?.first,
              last: theUser.name?.last,
            },
            email: theUser.email,
            phone: theUser.phone,
            profile_picture: theUser.profile_picture,
          },
        },
      }
    );

    return result.modifiedCount;
  } else {
    throw new Error("User not found");
  }
};

export const removeParticipant = async (
  tournamentId: string,
  userId: string
) => {
  console.log(userId);
  const result = await TournamentModel.updateOne(
    { _id: tournamentId },
    { $pull: { participants: { _id: userId } } }
  );
  return result.modifiedCount;
};

export const updateParticipantStatus = async (
  tournamentId: string,
  data: { userId: string; status: PARTICIPANT_STATUS_ENUM }
) => {
  const result = await TournamentModel.updateOne(
    { _id: tournamentId, "participants._id": data.userId },
    {
      $set: {
        "participants.$.status": data.status,
      },
    }
  );

  return result.modifiedCount;
};
