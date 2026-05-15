const jwt = require('jsonwebtoken');
const request = require('supertest');

jest.mock('../src/services/noteService', () => ({
  listNotes: jest.fn(),
  getNote: jest.fn(),
  createNote: jest.fn(),
  updateNote: jest.fn(),
  deleteNote: jest.fn(),
  shareNote: jest.fn(),
  listHistory: jest.fn(),
  restoreVersion: jest.fn()
}));

const app = require('../src/app');
const noteService = require('../src/services/noteService');
const { ForbiddenError } = require('../src/errors/AppError');

const token = jwt.sign({ sub: 'u1', email: 'u1@test.com' }, process.env.JWT_ACCESS_SECRET, { expiresIn: '15m' });

describe('Notes API', () => {
  test('requires auth', async () => {
    const response = await request(app).get('/notes');
    expect(response.status).toBe(401);
  });

  test('GET /notes returns paginated list', async () => {
    noteService.listNotes.mockResolvedValueOnce({ items: [], meta: { total: 0, page: 1, limit: 10, pages: 1 } });

    const response = await request(app).get('/notes?page=1&limit=10').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
  });

  test('POST /notes validates empty title/content', async () => {
    const response = await request(app).post('/notes').set('Authorization', `Bearer ${token}`).send({ title: '', content: '' });

    expect(response.status).toBe(400);
  });

  test('PUT /notes/:id handles permission errors', async () => {
    noteService.updateNote.mockRejectedValueOnce(new ForbiddenError('Only note owner can perform this action'));

    const response = await request(app)
      .put('/notes/n1')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'x', content: 'y', version: 1 });

    expect(response.status).toBe(403);
  });

  test('POST /notes/:id/share handles duplicate sharing conflict', async () => {
    const { ConflictError } = require('../src/errors/AppError');
    noteService.shareNote.mockRejectedValueOnce(new ConflictError('Note is already shared with this user'));

    const response = await request(app)
      .post('/notes/n1/share')
      .set('Authorization', `Bearer ${token}`)
      .send({ email: 'shared@example.com' });

    expect(response.status).toBe(409);
  });

  test('history and restore endpoints', async () => {
    noteService.listHistory.mockResolvedValueOnce([]);
    noteService.restoreVersion.mockResolvedValueOnce({ id: 'n1', title: 'restored', content: 'c', version: 2 });

    const history = await request(app).get('/notes/n1/history').set('Authorization', `Bearer ${token}`);
    const restore = await request(app)
      .post('/notes/n1/restore/v1')
      .set('Authorization', `Bearer ${token}`)
      .send({ version: 1 });

    expect(history.status).toBe(200);
    expect(restore.status).toBe(200);
  });
});
