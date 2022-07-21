import { Express } from "express";
import { createUserSessionHandler } from "../controller/session.controller";
import { validateRequest } from "../middleware";

import { createUserSessionSchema } from "../schema/session.schema";
export default function (app: Express) {
    // login 
    app.post("/api/session", validateRequest(createUserSessionSchema), createUserSessionHandler);
}