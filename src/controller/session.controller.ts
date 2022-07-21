import { Request, Response } from "express";
import { LeanDocument } from "mongoose";
import { createSession, createAccessToken, createRefreshToken } from "../service/session.service";
import { validatePassword } from "../service/user.service";


export async function createUserSessionHandler(req: Request, res: Response) {
    // validate email and password
    const user = await validatePassword(req.body);
    if (!user) {
        return res.status(401).json({
            message: "Invalid email or password"
        });
    }
    // create session
    const session = await createSession(user._id, req.get("user-agent") || "");

    // create accesstoken
    const accessToken = createAccessToken(user, session);

    // create refreshtoken
    const refreshToken= createRefreshToken(session);

    res.cookie("refreshToken", refreshToken,{expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365), httpOnly: true});
    res.setHeader("x-refresh-token",refreshToken);
    res.setHeader("x-access-token",accessToken);

    res.cookie("x-access-token", accessToken, { httpOnly: true});
    res.send({refreshToken:refreshToken,accessToken:accessToken});
}