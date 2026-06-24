import { Router } from 'express';
import { celebrate } from 'celebrate';
import { authenticate } from '../middleware/authenticate.js';

import {
  getAllNotesSchema,
  noteIdSchema,
  createNoteSchema,
  updateNoteSchema,
} from '../validations/notesValidation.js';

import {
  getAllNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
} from '../controllers/notesController.js';

const router = Router();

router.use(authenticate);

router.get(
  '/notes',
  celebrate({ query: getAllNotesSchema }),
  getAllNotes,
);

router.get(
  '/notes/:noteId',
  celebrate({ params: noteIdSchema }),
  getNoteById,
);

router.post(
  '/notes',
  celebrate({ body: createNoteSchema }),
  createNote,
);

router.patch(
  '/notes/:noteId',
  celebrate({
    params: noteIdSchema,
    body: updateNoteSchema,
  }),
  updateNote,
);

router.delete(
  '/notes/:noteId',
  celebrate({ params: noteIdSchema }),
  deleteNote,
);

export default router;