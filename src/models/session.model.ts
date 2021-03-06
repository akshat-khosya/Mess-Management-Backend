import mongoose from "mongoose";
import { UserDocument } from "./user.model";

export interface SessionDocument extends mongoose.Document {
    user: UserDocument["_id"];
    userAgent: String;
    createdAt: Date;
    updateAt: Date;
}

const SessionSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            unique:true,
            ref: "User"
        },
        userAgent: {
            type: String
        },
    },
    {
        timestamps: true
    }
);

const Session = mongoose.model<SessionDocument>("Session", SessionSchema);

export default Session;