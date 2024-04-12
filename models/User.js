import { Schema, model } from 'mongoose';
import { handleSaveError, setUpdateSetting } from './hooks.js';
import { emailRegepxp } from '../constants/user-constants.js';


const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    email: {
        type: String,
        match: emailRegepxp,
        required: [true, 'Email is required'],
        unique: true,
    },
    subscription: {
        type: String,
        enum: ["starter", "pro", "business"],
        default: "starter"
    },
    token: {
        type: String,
    },
}, { versionKey: false, timestamps: true }
)

UserSchema.post("save", handleSaveError)

UserSchema.pre("findOneAndUpdate", setUpdateSetting);

UserSchema.post("findOneAndUpdate", handleSaveError);

const User = model("user", UserSchema)
export default User