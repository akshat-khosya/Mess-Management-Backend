import _ from "lodash";
import { Request, Response, NextFunction } from "express";
import { decode } from "../utils/jwt.utils";
import { recreateAccessToken, sessionValidation } from "../service/session.service";


const deserializeUser = async (req: Request, res: Response, next: NextFunction) => {
    const accessToken = req.headers["x-access-token"] as string;
    const refreshToken = req.headers["x-refresh-token"] as string;
    if (!refreshToken || !accessToken) {
        return next();
    }
    const { decoded , expired } = decode(accessToken);
    if (decoded) {

        if (decoded.session.userAgent !== req.headers["user-agent"]) {
            return next();
        }
        if (!sessionValidation(decoded.session,refreshToken)) {
            return next();
        }
        req.user = decoded;
        next();
    }
    if (expired) {
        const newAccessToken = await recreateAccessToken(refreshToken);
        if (newAccessToken) {
            res.setHeader("x-access-token", newAccessToken);
            const { decoded } = decode(newAccessToken);
            req.user = decoded;
            next();

        }
        next();
    }
    next();



};

export default deserializeUser;
