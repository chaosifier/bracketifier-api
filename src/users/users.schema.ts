import mongoose, { Schema, model, InferSchemaType } from "mongoose";

const userSchema = new Schema(
  {
    name: {
      first: { type: String, required: true },
      last: { type: String, required: true },
    },
    email: { type: String, unique: true, required: true },
    phone: { type: String, index: false, unique: false },
    password: { type: String, required: true },
    profile_picture: { type: String, required: false },
    status: {
      type: String,
      enum: ["ACTIVE", "DISABLED", "DELETED"],
      default: "ACTIVE",
    },
  },
  { versionKey: false }
);

export type User = InferSchemaType<typeof userSchema>;
export const UserModel = model<User>("user", userSchema);
