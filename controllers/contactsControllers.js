import * as contactsService from "../services/contactsServices.js";
import HttpError from "../helpers/HttpError.js";

import ctrlWrapper from '../decorators/ctrlWrapper.js'

const getAll = async (req, res, next) => {
    try {
        const contacts = await contactsService.listContacts();
        res.json(contacts);
    } catch (error) {
        next(error);
    }
};

const getById = async (req, res, next) => {
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

const deleteById = async (req, res) => {
    
        const { id } = req.params;
        const deletedContact = await contactsService.removeContact(id);
        if (!deletedContact) {
            throw HttpError(404, 'Contact not found');
        }
        res.json(deletedContact);
    
};

const add = async (req, res) => {
  const result = await contactsService.addContact(req.body);
  res.status(201).json(result);
};

const updateById = async (req, res, next) => {
    
        const { id } = req.params;
        const result = await contactsService.updateContactId(id, req.body);
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