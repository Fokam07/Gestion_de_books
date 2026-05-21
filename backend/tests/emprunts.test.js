import request from 'supertest';
import app from '../src/app.js';
import { clearDatabase, prisma } from './helpers/db.js';
import { createUser } from './helpers/auth.js';

afterAll(() => prisma.$disconnect());
beforeEach(clearDatabase);

const setupLivreEtExemplaire = async (admin) => {
  const livreRes = await request(app)
    .post('/api/livres')
    .set('Authorization', admin.authHeader)
    .send({ titre: 'Le Petit Prince', auteur: 'Saint-Exupery' });
  const livreId = livreRes.body.id;

  const exRes = await request(app)
    .post(`/api/livres/${livreId}/exemplaires`)
    .set('Authorization', admin.authHeader)
    .send({ codeBarre: 'EX-001' });

  return { livreId, exemplaireId: exRes.body.id };
};

describe('POST /api/emprunts', () => {
  it('emprunte un exemplaire disponible -> 201, statut EMPRUNTE', async () => {
    const admin = await createUser({ role: 'admin' });
    const user = await createUser({ suffix: 'u2' });
    const { exemplaireId } = await setupLivreEtExemplaire(admin);

    const res = await request(app)
      .post('/api/emprunts')
      .set('Authorization', user.authHeader)
      .send({ exemplaireIds: [exemplaireId] });

    expect(res.status).toBe(201);
    expect(res.body.statut).toBe('EN_COURS');
    expect(res.body.exemplaires).toHaveLength(1);

    const ex = await prisma.exemplaire.findUnique({ where: { id: exemplaireId } });
    expect(ex.statut).toBe('EMPRUNTE');
  });

  it("refuse si l'exemplaire est deja EMPRUNTE -> 409", async () => {
    const admin = await createUser({ role: 'admin' });
    const user = await createUser({ suffix: 'u2' });
    const { exemplaireId } = await setupLivreEtExemplaire(admin);

    await request(app)
      .post('/api/emprunts')
      .set('Authorization', user.authHeader)
      .send({ exemplaireIds: [exemplaireId] });

    const res = await request(app)
      .post('/api/emprunts')
      .set('Authorization', user.authHeader)
      .send({ exemplaireIds: [exemplaireId] });

    expect(res.status).toBe(409);
  });

  it("refuse si l'exemplaireId est introuvable -> 404", async () => {
    const user = await createUser();
    const res = await request(app)
      .post('/api/emprunts')
      .set('Authorization', user.authHeader)
      .send({ exemplaireIds: [9999] });
    expect(res.status).toBe(404);
  });

  it('refuse sans token -> 401', async () => {
    const res = await request(app)
      .post('/api/emprunts')
      .send({ exemplaireIds: [1] });
    expect(res.status).toBe(401);
  });
});

describe('PATCH /api/emprunts/:id/retourner', () => {
  it('retourne les exemplaires -> statut RETOURNE + exemplaire DISPONIBLE', async () => {
    const admin = await createUser({ role: 'admin' });
    const user = await createUser({ suffix: 'u2' });
    const { exemplaireId } = await setupLivreEtExemplaire(admin);

    const emprunt = await request(app)
      .post('/api/emprunts')
      .set('Authorization', user.authHeader)
      .send({ exemplaireIds: [exemplaireId] });

    const res = await request(app)
      .patch(`/api/emprunts/${emprunt.body.id}/retourner`)
      .set('Authorization', user.authHeader);

    expect(res.status).toBe(200);
    expect(res.body.statut).toBe('RETOURNE');
    expect(res.body.dateRetour).not.toBeNull();

    const ex = await prisma.exemplaire.findUnique({ where: { id: exemplaireId } });
    expect(ex.statut).toBe('DISPONIBLE');
  });

  it("refuse si l'emprunt appartient a un autre user -> 403", async () => {
    const admin = await createUser({ role: 'admin' });
    const userA = await createUser({ suffix: 'A' });
    const userB = await createUser({ suffix: 'B' });
    const { exemplaireId } = await setupLivreEtExemplaire(admin);

    const emprunt = await request(app)
      .post('/api/emprunts')
      .set('Authorization', userA.authHeader)
      .send({ exemplaireIds: [exemplaireId] });

    const res = await request(app)
      .patch(`/api/emprunts/${emprunt.body.id}/retourner`)
      .set('Authorization', userB.authHeader);

    expect(res.status).toBe(403);
  });

  it('refuse un retour deja effectue -> 409', async () => {
    const admin = await createUser({ role: 'admin' });
    const user = await createUser({ suffix: 'u2' });
    const { exemplaireId } = await setupLivreEtExemplaire(admin);

    const emprunt = await request(app)
      .post('/api/emprunts')
      .set('Authorization', user.authHeader)
      .send({ exemplaireIds: [exemplaireId] });

    await request(app)
      .patch(`/api/emprunts/${emprunt.body.id}/retourner`)
      .set('Authorization', user.authHeader);

    const res = await request(app)
      .patch(`/api/emprunts/${emprunt.body.id}/retourner`)
      .set('Authorization', user.authHeader);

    expect(res.status).toBe(409);
  });

  it("laisse l'exemplaire en RESERVE si une reservation active existe (switch)", async () => {
    const admin = await createUser({ role: 'admin' });
    const userA = await createUser({ suffix: 'A' });
    const userB = await createUser({ suffix: 'B' });
    const { livreId, exemplaireId } = await setupLivreEtExemplaire(admin);

    const emprunt = await request(app)
      .post('/api/emprunts')
      .set('Authorization', userA.authHeader)
      .send({ exemplaireIds: [exemplaireId] });

    await request(app)
      .post('/api/reservations')
      .set('Authorization', userB.authHeader)
      .send({ livreId });

    await request(app)
      .patch(`/api/emprunts/${emprunt.body.id}/retourner`)
      .set('Authorization', userA.authHeader);

    const ex = await prisma.exemplaire.findUnique({ where: { id: exemplaireId } });
    expect(ex.statut).toBe('RESERVE');
  });
});

describe('GET /api/emprunts/mes-emprunts', () => {
  it("retourne uniquement les emprunts de l'utilisateur connecte", async () => {
    const admin = await createUser({ role: 'admin' });
    const userA = await createUser({ suffix: 'A' });
    const userB = await createUser({ suffix: 'B' });
    const { exemplaireId } = await setupLivreEtExemplaire(admin);

    await request(app)
      .post('/api/emprunts')
      .set('Authorization', userA.authHeader)
      .send({ exemplaireIds: [exemplaireId] });

    const res = await request(app)
      .get('/api/emprunts/mes-emprunts')
      .set('Authorization', userB.authHeader);

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(0);
  });
});
