import { hash } from "bcrypt";
import { User, UserModel } from "./users.schema"

export const createUser = async (userDetail: User) => {
    const hashed_password = await hash(userDetail.password, 10);
    console.log(`hash `, hashed_password);
    const result = await UserModel.create({
        ...userDetail,
        password: hashed_password,
    });

    return result._id;
}

export const getUserById = async (email: string) => {
    const result = await UserModel.findOne({ email: email, status: 'ACTIVE' });
    return result;
}