
import jwt from "jsonwebtoken";

import ctrlWrapper from "../decorators/ctrlWrapper.js";
import bcrypt from "bcrypt"
import * as authServices from "../services/authServices.js";
import HttpError from "../helpers/HttpError.js";

const { JWT_SECRET } = process.env;

const signup = async (req, res) => {
    const { email, password } = req.body;
    const user = await authServices.findUser({ email });
    if (user) {
        throw HttpError(409, "Email already in use");
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await authServices.signup({ ...req.body, password: hashPassword });

    res.status(201).json({
        "user": {
        email: newUser.email,
        subscription: newUser.subscription,
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

export default {
    signup: ctrlWrapper(signup),
    singin: ctrlWrapper(singin),
    getCurrent: ctrlWrapper(getCurrent),
    signout: ctrlWrapper(signout)

}