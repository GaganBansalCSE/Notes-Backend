const request = require('supertest');

jest.mock('../src/services/authService', () => ({
  register: jest.fn(),
  login: jest.fn(),
  refresh: jest.fn(),
  logout: jest.fn()
}));

const app = require('../src/app');
const authService = require('../src/services/authService');

describe('Auth API', () => {
  test('POST /register returns 201', async () => {
    authService.register.mockResolvedValueOnce({ user: { id: 'u1', email: 'a@b.com' }, accessToken: 'a', refreshToken: 'r' });

    const response = await request(app).post('/register').send({ email: 'a@b.com', password: 'password123', name: 'A' });

    expect(response.status).toBe(201);
    expect(authService.register).toHaveBeenCalled();
  });

  test('POST /register rejects duplicate email conflict', async () => {
    const { ConflictError } = require('../src/errors/AppError');
    authService.register.mockRejectedValueOnce(new ConflictError('Email already registered'));

    const response = await request(app).post('/register').send({ email: 'a@b.com', password: 'password123', name: 'A' });

    expect(response.status).toBe(409);
  });

  test('POST /login validates payload', async () => {
    const response = await request(app).post('/login').send({ email: 'bad' });
    expect(response.status).toBe(400);
  });

  test('POST /refresh-token returns 200', async () => {
    authService.refresh.mockResolvedValueOnce({ accessToken: 'next', refreshToken: 'new' });

    const response = await request(app).post('/refresh-token').send({ refreshToken: 'rt' });

    expect(response.status).toBe(200);
  });

  test('POST /logout returns 204', async () => {
    authService.logout.mockResolvedValueOnce();

    const response = await request(app).post('/logout').send({ refreshToken: 'rt' });

    expect(response.status).toBe(204);
  });
});
