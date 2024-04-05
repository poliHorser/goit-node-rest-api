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
            throw HttpError(404, 'Contact not found');
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
            throw HttpError(404, 'Contact not found');
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
            throw HttpError(400, error.message);
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

        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ message: 'Body must have at least one field' });
        }
        const { error } = updateContactSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.message });
        }

        const result = await contactsService.updateContactId(id, req.body);
        if (!result) {
            return res.status(404).json({ message: 'Not found' });
        }

        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};
