import { UserDocument } from "../models/user.model";
import User from "../models/user.model";
import _ from "lodash";
import { DocumentDefinition, FilterQuery } from "mongoose";

export async function createUser(input: DocumentDefinition<UserDocument>) {
    try {
      return await User.create(input);
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }
export async function validatePassword(
    { email, password }:
        {
            email: UserDocument["email"];
            password: string
        }): Promise<Omit<UserDocument, 'password'> | undefined>{
    const user = await User.findOne({ email });
    if(!user){
        return undefined;
    }
    const isValid=user.comparePassword(password);
    if(!isValid){
        return undefined;
    }
    return _.omit(user,"password");

}

export async function findUser(query: FilterQuery<UserDocument>) {
    return User.findOne(query).lean();
  }