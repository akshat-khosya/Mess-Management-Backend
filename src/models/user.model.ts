import mongoose from "mongoose";
import config from "config";
import bcrypt from "bcrypt";

export interface UserDocument extends mongoose.Document {
    email: string;
    name: string;
    password: string;
    role: string;
    type: string;
    createdAt: Date;
    updatedAt: Date;
    comparePassword: (candidatePassword: string) => Promise<boolean>;

}

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        default: "user"
    },

},
    {
        timestamps: true
    }
);

UserSchema.pre("save", async function (next: any) {
    let user = this as UserDocument;
    if (!user.isModified("password")) {
        return next();
    }
    const salt = await bcrypt.genSalt(config.get("saltWorkFactor") as number);
    const hash = await bcrypt.hashSync(user.password, salt);
    user.password = hash;
    return next();
}
);

UserSchema.methods.comparePassword = async function (candidatePassword: string) {
    const user = this as UserDocument;
    return bcrypt.compare(candidatePassword, user.password).catch((e) => false);
}

const User = mongoose.model<UserDocument>("User", UserSchema);
export default User;