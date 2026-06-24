import createHttpError from 'http-errors';
import { Note } from '../models/note.js';

// GET ALL NOTES (только user)
export const getAllNotes = async (req, res, next) => {
  try {
    const { page = 1, perPage = 10, tag, search } = req.query;

    const filter = { userId: req.user._id };

    if (tag) filter.tag = tag;

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * perPage;

    const notes = await Note.find(filter)
      .skip(skip)
      .limit(perPage);

    const totalNotes = await Note.countDocuments(filter);

    res.json({
      page: Number(page),
      perPage: Number(perPage),
      totalNotes,
      totalPages: Math.ceil(totalNotes / perPage),
      notes,
    });
  } catch (error) {
    next(error);
  }
};

// GET BY ID
export const getNoteById = async (req, res, next) => {
  try {
    const { noteId } = req.params;

    const note = await Note.findOne({
      _id: noteId,
      userId: req.user._id,
    });

    if (!note) {
      throw createHttpError(404, 'Note not found');
    }

    res.json(note);
  } catch (error) {
    next(error);
  }
};

// CREATE
export const createNote = async (req, res, next) => {
  try {
    const note = await Note.create({
      ...req.body,
      userId: req.user._id,
    });

    res.status(201).json(note);
  } catch (error) {
    next(error);
  }
};

// UPDATE
export const updateNote = async (req, res, next) => {
  try {
    const { noteId } = req.params;

    const note = await Note.findOneAndUpdate(
      {
        _id: noteId,
        userId: req.user._id,
      },
      req.body,
      { returnDocument: 'after' },
    );

    if (!note) {
      throw createHttpError(404, 'Note not found');
    }

    res.json(note);
  } catch (error) {
    next(error);
  }
};

// DELETE
export const deleteNote = async (req, res, next) => {
  try {
    const { noteId } = req.params;

    const note = await Note.findOneAndDelete({
      _id: noteId,
      userId: req.user._id,
    });

    if (!note) {
      throw createHttpError(404, 'Note not found');
    }

    res.json(note);
  } catch (error) {
    next(error);
  }
};