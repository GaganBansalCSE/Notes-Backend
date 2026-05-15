const express = require('express');
const noteController = require('../controllers/noteController');
const authenticate = require('../middlewares/authenticate');
const validate = require('../middlewares/validate');
const {
  noteBodySchema,
  noteUpdateSchema,
  shareSchema,
  restoreSchema,
  listNotesSchema
} = require('../validators/noteValidator');

const router = express.Router();

router.get('/notes', authenticate, validate(listNotesSchema, 'query'), noteController.listNotes);
router.get('/notes/:id', authenticate, noteController.getNote);
router.post('/notes', authenticate, validate(noteBodySchema), noteController.createNote);
router.put('/notes/:id', authenticate, validate(noteUpdateSchema), noteController.updateNote);
router.delete('/notes/:id', authenticate, noteController.deleteNote);
router.post('/notes/:id/share', authenticate, validate(shareSchema), noteController.shareNote);
router.get('/notes/:id/history', authenticate, noteController.listHistory);
router.post('/notes/:id/restore/:versionId', authenticate, validate(restoreSchema), noteController.restoreVersion);

module.exports = router;
