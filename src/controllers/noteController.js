const asyncHandler = require('../utils/asyncHandler');
const noteService = require('../services/noteService');

const listNotes = asyncHandler(async (req, res) => {
  const result = await noteService.listNotes(req.user.id, req.query);
  res.status(200).json(result);
});

const getNote = asyncHandler(async (req, res) => {
  const note = await noteService.getNote(req.params.id, req.user.id);
  res.status(200).json(note);
});

const createNote = asyncHandler(async (req, res) => {
  const note = await noteService.createNote(req.body, req.user.id);
  res.status(201).json(note);
});

const updateNote = asyncHandler(async (req, res) => {
  const note = await noteService.updateNote(req.params.id, req.body, req.user.id);
  res.status(200).json(note);
});

const deleteNote = asyncHandler(async (req, res) => {
  await noteService.deleteNote(req.params.id, req.user.id);
  res.status(204).send();
});

const shareNote = asyncHandler(async (req, res) => {
  const share = await noteService.shareNote(req.params.id, req.body.email, req.user.id);
  res.status(201).json(share);
});

const listHistory = asyncHandler(async (req, res) => {
  const history = await noteService.listHistory(req.params.id, req.user.id);
  res.status(200).json(history);
});

const restoreVersion = asyncHandler(async (req, res) => {
  const note = await noteService.restoreVersion(req.params.id, req.params.versionId, req.body.version, req.user.id);
  res.status(200).json(note);
});

module.exports = {
  listNotes,
  getNote,
  createNote,
  updateNote,
  deleteNote,
  shareNote,
  listHistory,
  restoreVersion
};
