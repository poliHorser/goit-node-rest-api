import Joi from "joi";

export const createContactSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
    favourite: Joi.boolean()
});

export const updateContactSchema = Joi.object({
    name: Joi.string(),
    email: Joi.string().email(),
    phone: Joi.string(),
    favourite: Joi.boolean()
}).min(1);

export const updateFavoriteSchema = Joi.object({
  favorite: Joi.boolean()
    .required()
});