
import jwt from "jsonwebtoken";
import gravatar from "gravatar"
import fs from "fs/promises"
import path from "path"
import bcrypt from "bcrypt"
import jimp from "jimp"

import ctrlWrapper from "../decorators/ctrlWrapper.js";
import * as authServices from "../services/authServices.js";
import HttpError from "../helpers/HttpError.js";



const { JWT_SECRET } = process.env;
const avatarPath = path.resolve("public", "avatars")


const signup = async (req, res) => {
    const { email, password } = req.body;
    const user = await authServices.findUser({ email });
    if (user) {
        throw HttpError(409, "Email already in use");
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const avatar = gravatar.url('emerleite@gmail.com', {s: '200', r: 'pg', d: '404'})
    const newUser = await authServices.signup({ ...req.body, password: hashPassword });

    res.status(201).json({
        "user": {
        email: newUser.email,
        subscription: newUser.subscription,
        avatarURL:  avatar
        }
    })
}

const singin = async (req, res) => {
    const { email, password } = req.body;
    const user = await authServices.findUser({ email });
    if (!user) {
        throw HttpError(401, "Email or password invalid");
    }
    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
        throw HttpError(401, "Email or password invalid");
    }

    const { _id: id } = user;

    const payload = {
        id
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "23h" });
    await authServices.updateUser({ _id: id }, { token });
    

    res.json({
    token,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  });
}

const getCurrent = async (req, res) => {
    const { subscription, email } = req.user;

    res.json({
        email,
        subscription,
    })
}

const signout = async (req, res) => {
    const { _id } = req.user;
    await authServices.updateUser({ _id }, { token: "" });

    res.status(204).json()
}

const avatarUpdate = async (req, res) => {
    const { _id } = req.user;

    if (!req.file) {
        throw HttpError(400, "No avatar to upload")
    }

    const { path: oldPath, originalname } = req.file;

    const img = await jimp.read(oldPath);
    await img.resize(250, 250).writeAsync(oldPath);

    
    const avatarFileName = `${Date.now()}-${originalname}`
    const newAvatarPath = path.join(avatarPath, avatarFileName);
    await fs.rename(oldPath, newAvatarPath);

    const avatarURL = path.join('avatars', avatarFileName);
    await authServices.updateAvatar(_id, { avatarURL })
    
    res.status(200).json({ avatarURL })
}

export default {
    signup: ctrlWrapper(signup),
    singin: ctrlWrapper(singin),
    getCurrent: ctrlWrapper(getCurrent),
    signout: ctrlWrapper(signout),
    avatarUpdate: ctrlWrapper(avatarUpdate)

}