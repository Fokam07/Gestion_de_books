import request from 'supertest';
import app from '../../src/app.js';
import { prisma } from './db.js';

let _counter = 0;
const uid = () => ++_counter;

// Crée un user, le connecte, retourne ses tokens et son header Authorization
export const createUser = async ({ suffix = uid(), role = 'user' } = {}) => {
  const email = `user${suffix}@test.com`;
  const password = 'Password123!';

  await request(app).post('/api/auth/register').send({
    nom: `User ${suffix}`,
    email,
    password,
  });

  // Pour le rôle admin, on force directement en BD
  if (role === 'admin') {
    await prisma.user.update({ where: { email }, data: { role: 'admin' } });
  }

  const res = await request(app).post('/api/auth/login').send({ email, password });
  // authService retourne { token, refreshToken } (pas accessToken)
  const { token, refreshToken } = res.body;

  return {
    email,
    accessToken: token,
    refreshToken,
    authHeader: `Bearer ${token}`,
  };
};
