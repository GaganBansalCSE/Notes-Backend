const jwt = require('jsonwebtoken');
const request = require('supertest');

jest.mock('../src/services/searchService', () => ({
  searchNotes: jest.fn()
}));

const app = require('../src/app');
const searchService = require('../src/services/searchService');

const token = jwt.sign({ sub: 'u1', email: 'u1@test.com' }, process.env.JWT_ACCESS_SECRET, { expiresIn: '15m' });

describe('Search API', () => {
  test('GET /search validates query', async () => {
    const response = await request(app).get('/search').set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(400);
  });

  test('GET /search returns matches', async () => {
    searchService.searchNotes.mockResolvedValueOnce({ items: [{ id: 'n1' }], meta: { page: 1, limit: 10, count: 1 } });

    const response = await request(app).get('/search?q=hello').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(searchService.searchNotes).toHaveBeenCalled();
  });
});
