import express from "express";
import authControllers from "../controllers/authControllers.js";
import {
    userSigninSchema,
    userSignupSchema
} from "../schemas/userSchemas.js";
import validateBody from "../decorators/validateBody.js"
import authenticate from "../middlewares/authenticate.js";

const authRouter = express.Router()

authRouter.get("/current", authenticate, authControllers.getCurrent);

authRouter.post("/logout", authenticate, authControllers.signout);

authRouter.post("/register", validateBody(userSignupSchema), authControllers.signup)

authRouter.post("/login", validateBody(userSigninSchema), authControllers.singin);

export default authRouter