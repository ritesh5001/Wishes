import Contact from "../models/Contact.js";

// ➕ Add new contact
export const addContact = async (req, res) => {
  try {
    const { firstName, lastName, phone, email, address, tags, notes, events } = req.body;

    // Validate required fields
    if (!firstName || !phone) {
      return res.status(400).json({ message: "First name and phone are required" });
    }

    const contact = new Contact({
      ownerId: req.user.id,
      firstName,
      lastName,
      phone,
      email,
      address,
      tags,
      notes,
      events,
    });

    await contact.save();
    res.status(201).json({ message: "Contact added", contact });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 📜 Get all contacts for logged user
export const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find({ ownerId: req.user.id }).sort({ createdAt: -1 });
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔍 Get single contact
export const getContactById = async (req, res) => {
  try {
    const contact = await Contact.findOne({ _id: req.params.id, ownerId: req.user.id });
    if (!contact) return res.status(404).json({ message: "Contact not found" });
    res.json(contact);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✏️ Update contact
export const updateContact = async (req, res) => {
  try {
    const contact = await Contact.findOneAndUpdate(
      { _id: req.params.id, ownerId: req.user.id },
      req.body,
      { new: true }
    );
    if (!contact) return res.status(404).json({ message: "Contact not found" });
    res.json({ message: "Contact updated", contact });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🗑 Delete contact
export const deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findOneAndDelete({ _id: req.params.id, ownerId: req.user.id });
    if (!contact) return res.status(404).json({ message: "Contact not found" });
    res.json({ message: "Contact deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};