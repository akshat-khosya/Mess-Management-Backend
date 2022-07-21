import { Express } from "express";
import sessionRoutes from "./session.route";
import userRoutes from "./user.route";
export default function (app: Express) {
    userRoutes(app);
    sessionRoutes(app);
}