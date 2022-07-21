import { Express } from "express";
import { createUserHandler } from "../controller/user.controller";

import { validateRequest } from "../middleware";
import { createUserSchema } from "../schema/user.schema";


export default function (app: Express) {
    // login 
    app.post("/api/user", validateRequest(createUserSchema),createUserHandler);
}