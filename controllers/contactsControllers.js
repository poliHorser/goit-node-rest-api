import * as contactsService from "../services/contactsServices.js";

export const getAllContacts = async (req, res, next) => {
    try {
        const contacts = await contactsService.listContacts();
        res.json(contacts)
    }
    catch (error) {
        next(error)
    }
};

export const getOneContact = async(req, res, next) => {
    try {
        const { id } = req.params;
        const contacts = await contactsService.getContactById(id);
        if (!contacts) {
            throw HttpError(404, 'Contact not found');
        }

        res.json(contacts);
    }
    catch (error) {
        next(error);
    }
};

export const deleteContact = async(req, res, next) => {
    try {
        const {id} = req.params;
        const contacts = await contactsService.removeContact(id);
        if (!contacts) {
            throw HttpError(404, `Contact not found`);
        }

        res.json({
            message: "Delete success"
        });
    }
    catch(error) {
        next(error);
    }
};

export const createContact = async(req, res, next) => {
    try {
        const { name, email, phone } = req.body;
        const newContact = await contactsService.addContact(name, email, phone);
        res.status(201).json(newContact);
    } catch (error) {
        next(error);
    }
};

export const updateContact = async (req, res, next) => {
    try {
        const {id} = req.params;
        const result = await contactsService.updateContactId(id, req.body);
        if (!result) {
            throw HttpError(404, `Movie with id=${id} not found`);
        }

        res.json(result);
    }
    catch(error) {
        next(error);
    }
};
