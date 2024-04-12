import * as contactsService from "../services/contactsServices.js";
import HttpError from "../helpers/HttpError.js";

import ctrlWrapper from '../decorators/ctrlWrapper.js'

const getAll = async (req, res, next) => {
    try {
        const { _id: owner } = req.user;
        const {page = 1, limit = 20} = req.query;
        const skip = (page - 1) * limit;
        const contacts = await contactsService.listContacts({ owner }, { skip, limit });
        const count = await contactsService.countContacts({owner})
        res.json({
            contacts,
            count
        });
    } catch (error) {
        next(error);
    }
};

const getById = async (req, res, next) => {
    try {
        const {_id: owner} = req.user
        const { id } = req.params;
        const contact = await contactsService.getContactByFilter({owner, _id: id});
        if (!contact) {
            throw HttpError(404, 'Contact not found');
        }
        res.json(contact);
    } catch (error) {
        next(error);
    }
};

const deleteById = async (req, res) => {
        const {_id: owner} = req.user;
        const { id } = req.params;
        const deletedContact = await contactsService.removeContactByFilter({owner, _id: id});
        if (!deletedContact) {
            throw HttpError(404, 'Contact not found');
        }
        res.json(deletedContact);
    
};

const add = async (req, res) => {
    const {_id: owner} = req.user;
    const result = await contactsService.addContact({...req.body, owner});
    res.status(201).json(result);
};

const updateById = async (req, res, next) => {
        const {_id: owner} = req.user;
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ message: 'Body must have at least one field' });
        }
        const { id } = req.params;
        const result = await contactsService.updateContactByFilter({owner, _id: id}, req.body);
        if (!result) {
            return res.status(404).json({ message: 'Not found' });
        }

        res.status(200).json(result);
}

const favorite = async (req, res, next) => {
    const { id } = req.params;
    const updatedContact = await contactsService.updateStatusContact(id, req.body);

    if (!updatedContact) {
      return res.status(404).json({ message: "Not found" });
    }
    res.status(200).json(updatedContact);
};

export default {
    favorite: ctrlWrapper(favorite),
    getAll: ctrlWrapper(getAll),
    getById: ctrlWrapper(getById),
    add: ctrlWrapper(add),
    updateById: ctrlWrapper(updateById),
    deleteById: ctrlWrapper(deleteById),
}