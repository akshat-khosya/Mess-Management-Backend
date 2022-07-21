import config from "config";
import { LeanDocument } from "mongoose";
import Session, { SessionDocument } from "../models/session.model";
import { UserDocument } from "../models/user.model";
import { decode, sign } from "../utils/jwt.utils";
import { findUser } from "./user.service";

export async function createSession(userId: string, userAgent: string) {
    const checkSession = await Session.findOneAndDelete({ user: userId });
    const session = await Session.create({ user: userId, userAgent });
    return session;
}

export function createAccessToken(
    user: Omit<UserDocument, "password"> | LeanDocument<Omit<UserDocument, "password">>,
    session: SessionDocument
): string {
    const accessToken = sign({ user: user.toJSON(), session: session.toJSON().id }, { expiresIn: config.get("accessTokenTtl") as string });
    return accessToken;

}

export function createRefreshToken(session: SessionDocument): string {
    const refreshToken = sign({session:session}, { expiresIn: config.get("refreshTokenTtl") as string });
    return refreshToken;
}

export async function sessionValidation(  session: any, refreshToken: string ): Promise<boolean> {
    const {decoded}=decode(refreshToken);
    if(decoded){
        if(decoded.user!==session.user){
            return false;
        }
        const checkSession=await Session.findOne({user:session.user});
        if(!checkSession){
            return false;
        }
        if(checkSession.user!==session.user){
            return false;
        }
        return true;
    }
   
    return false;
}

export async function recreateAccessToken(refreshToken:string) {
    const {decoded}=decode(refreshToken);
    if(decoded){
        const session=await Session.findOne({user:decoded.user});
        if(!session){
            return false;
        }
        const user= await findUser({ _id: session.user});
        if(!user) return false;
        const accessToken=createAccessToken(user,session);
        return accessToken;
    }
    return false;

}