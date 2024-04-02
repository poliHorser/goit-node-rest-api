import * as contactsService from "../services/contactsServices.js";
import HttpError from "../helpers/HttpError.js";
import { createContactSchema, updateContactSchema } from "../schemas/contactsSchemas.js";

export const getAllContacts = async (req, res, next) => {
    try {
        const contacts = await contactsService.listContacts();
        res.json(contacts);
    } catch (error) {
        next(error);
    }
};

export const getOneContact = async (req, res, next) => {
    try {
        const { id } = req.params;
        const contact = await contactsService.getContactById(id);
        if (!contact) {
            throw new HttpError(404, 'Contact not found');
        }
        res.json(contact);
    } catch (error) {
        next(error);
    }
};

export const deleteContact = async (req, res, next) => {
    try {
        const { id } = req.params;
        const deletedContact = await contactsService.removeContact(id);
        if (!deletedContact) {
            throw new HttpError(404, 'Contact not found');
        }
        res.json(deletedContact);
    } catch (error) {
        next(error);
    }
};

export const createContact = async (req, res, next) => {
    try {
        const { name, email, phone } = req.body;
        const { error } = createContactSchema.validate({ name, email, phone });
        if (error) {
            throw new HttpError(400, error.message);
        }
        const newContact = await contactsService.addContact(name, email, phone);
        res.status(201).json(newContact);
    } catch (error) {
        next(error);
    }
};

export const updateContact = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, email, phone } = req.body;
        const { error } = updateContactSchema.validate({ name, email, phone });
        if (error) {
            throw new HttpError(400, error.message);
        }
        const updatedContact = await contactsService.updateContact(id, { name, email, phone });
        if (!updatedContact) {
            throw new HttpError(404, `Contact with id=${id} not found`);
        }
        res.json(updatedContact);
    } catch (error) {
        next(error);
    }
};
