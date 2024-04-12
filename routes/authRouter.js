import express from "express";
import authControllers from "../controllers/authControllers.js";
import {
    userSigninSchema,
    userSignupSchema
} from "../schemas/userSchemas.js";
import validateBody from "../decorators/validateBody.js"
import authenticate from "../middlewares/authenticate.js";

const authRouter = express.Router()

authRouter.get("/users/current", authenticate, authControllers.getCurrent);

authRouter.post("/users/logout", authenticate, authControllers.signout);

authRouter.post("/users/register", validateBody(userSignupSchema), authControllers.signup)

authRouter.post("/users/login", validateBody(userSigninSchema), authControllers.singin);

export default authRouter