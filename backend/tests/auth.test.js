import request from 'supertest';
import app from '../src/app.js';
import { clearDatabase, prisma } from './helpers/db.js';

afterAll(() => prisma.$disconnect());
beforeEach(clearDatabase);

const BASE = '/api/auth';
const USER = { nom: 'Alice', email: 'alice@test.com', password: 'Password123!' };

describe('POST /api/auth/register', () => {
  it('crée un user et retourne ses infos', async () => {
    const res = await request(app).post(`${BASE}/register`).send(USER);
    expect(res.status).toBe(201);
    expect(res.body.user).toMatchObject({ nom: USER.nom, email: USER.email });
    expect(res.body.user.password).toBeUndefined();
  });

  it('refuse un email déjà utilisé → 409', async () => {
    await request(app).post(`${BASE}/register`).send(USER);
    const res = await request(app).post(`${BASE}/register`).send(USER);
    expect(res.status).toBe(409);
  });

  it('refuse des données invalides → 400', async () => {
    const res = await request(app).post(`${BASE}/register`).send({ email: 'pas-un-email' });
    expect(res.status).toBe(400);
  });
});

describe('POST /api/auth/login', () => {
  beforeEach(async () => {
    await request(app).post(`${BASE}/register`).send(USER);
  });

  it('retourne token + refreshToken', async () => {
    const res = await request(app).post(`${BASE}/login`).send({
      email: USER.email,
      password: USER.password,
    });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    expect(res.body.refreshToken).toBeDefined();
  });

  it('refuse un mauvais mot de passe → 401', async () => {
    const res = await request(app).post(`${BASE}/login`).send({
      email: USER.email,
      password: 'mauvais',
    });
    expect(res.status).toBe(401);
  });

  it('refuse un email inconnu → 401', async () => {
    const res = await request(app).post(`${BASE}/login`).send({
      email: 'inconnu@test.com',
      password: USER.password,
    });
    expect(res.status).toBe(401);
  });
});

describe('GET /api/auth/me', () => {
  it('retourne le profil avec un token valide', async () => {
    await request(app).post(`${BASE}/register`).send(USER);
    const login = await request(app).post(`${BASE}/login`).send({
      email: USER.email, password: USER.password,
    });
    const res = await request(app)
      .get(`${BASE}/me`)
      .set('Authorization', `Bearer ${login.body.token}`);
    expect(res.status).toBe(200);
    expect(res.body.email).toBe(USER.email);
  });

  it('refuse sans token → 401', async () => {
    const res = await request(app).get(`${BASE}/me`);
    expect(res.status).toBe(401);
  });
});

describe('POST /api/auth/refresh', () => {
  it('émet de nouveaux tokens depuis un refreshToken valide', async () => {
    await request(app).post(`${BASE}/register`).send(USER);
    const login = await request(app).post(`${BASE}/login`).send({
      email: USER.email, password: USER.password,
    });
    const res = await request(app).post(`${BASE}/refresh`).send({
      refreshToken: login.body.refreshToken,
    });
    expect(res.status).toBe(200);
    // refresh retourne { accessToken } (generateTokens), login retourne { token } (login)
    expect(res.body.accessToken).toBeDefined();
  });

  it('refuse un token invalide → 403', async () => {
    const res = await request(app).post(`${BASE}/refresh`).send({
      refreshToken: 'token.bidon.ici',
    });
    expect(res.status).toBe(403);
  });
});
