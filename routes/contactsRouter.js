import express from "express";
import contactsControllers from "../controllers/contactsControllers.js";


import isValidId from '../middlewares/isValidId.js';
import { createContactSchema, updateContactSchema, updateFavoriteSchema } from "../schemas/contactsSchemas.js";
import validateBody from '../decorators/validateBody.js';
import authenticate from "../middlewares/authenticate.js";
import upload from "../middlewares/upload.js";

const contactsRouter = express.Router();

contactsRouter.use(authenticate)

contactsRouter.get("/", contactsControllers.getAll);

contactsRouter.get("/:id", isValidId, contactsControllers.getById);

contactsRouter.delete("/:id", isValidId, contactsControllers.deleteById);

contactsRouter.post("/", upload.single("avatars"),  validateBody(createContactSchema), contactsControllers.add);

contactsRouter.put("/:id", isValidId, validateBody(updateContactSchema), contactsControllers.updateById);
contactsRouter.patch("/:id/favorite", isValidId,  validateBody(updateFavoriteSchema), contactsControllers.favorite)

export default contactsRouter;
