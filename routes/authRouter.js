import express from "express";
import authControllers from "../controllers/authControllers.js";
import {
    userSigninSchema,
    userSignupSchema,
    userEmailSchema
} from "../schemas/userSchemas.js";
import validateBody from "../decorators/validateBody.js"
import authenticate from "../middlewares/authenticate.js";
import upload from "../middlewares/upload.js";

const authRouter = express.Router()

authRouter.get("/current", authenticate, authControllers.getCurrent);

authRouter.post("/logout", authenticate, authControllers.signout);

authRouter.post("/register", validateBody(userSignupSchema), authControllers.signup)

authRouter.post("/login", validateBody(userSigninSchema), authControllers.singin);

authRouter.get('/verify/:verificationToken', authControllers.verify);

authRouter.post('/verify', validateBody(userEmailSchema), authControllers.resendVerify);

authRouter.patch("/avatars", authenticate, upload.single("avatar"), authControllers.avatarUpdate)

export default authRouter