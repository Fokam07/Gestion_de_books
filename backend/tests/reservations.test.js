import request from 'supertest';
import app from '../src/app.js';
import { clearDatabase, prisma } from './helpers/db.js';
import { createUser } from './helpers/auth.js';

afterAll(() => prisma.$disconnect());
beforeEach(clearDatabase);

const setupLivreEtExemplaire = async (admin, codeBarre = 'EX-001') => {
  const livreRes = await request(app)
    .post('/api/livres')
    .set('Authorization', admin.authHeader)
    .send({ titre: 'Fondation', auteur: 'Isaac Asimov' });
  const livreId = livreRes.body.id;

  const exRes = await request(app)
    .post(`/api/livres/${livreId}/exemplaires`)
    .set('Authorization', admin.authHeader)
    .send({ codeBarre });

  return { livreId, exemplaireId: exRes.body.id };
};

describe('POST /api/reservations', () => {
  it('refuse si un exemplaire est DISPONIBLE -> 409', async () => {
    const admin = await createUser({ role: 'admin' });
    const user = await createUser({ suffix: 'u' });
    const { livreId } = await setupLivreEtExemplaire(admin);

    const res = await request(app)
      .post('/api/reservations')
      .set('Authorization', user.authHeader)
      .send({ livreId });

    expect(res.status).toBe(409);
    expect(res.body.message).toMatch(/disponible/i);
  });

  it('cree une reservation quand tous les exemplaires sont EMPRUNTES -> 201', async () => {
    const admin = await createUser({ role: 'admin' });
    const userA = await createUser({ suffix: 'A' });
    const userB = await createUser({ suffix: 'B' });
    const { livreId, exemplaireId } = await setupLivreEtExemplaire(admin);

    await request(app)
      .post('/api/emprunts')
      .set('Authorization', userA.authHeader)
      .send({ exemplaireIds: [exemplaireId] });

    const res = await request(app)
      .post('/api/reservations')
      .set('Authorization', userB.authHeader)
      .send({ livreId });

    expect(res.status).toBe(201);
    expect(res.body.statut).toBe('ACTIVE');
    expect(res.body.exemplaire.id).toBe(exemplaireId);

    const ex = await prisma.exemplaire.findUnique({ where: { id: exemplaireId } });
    expect(ex.statut).toBe('RESERVE');
  });

  it('refuse une double reservation sur le meme livre -> 409', async () => {
    const admin = await createUser({ role: 'admin' });
    const userA = await createUser({ suffix: 'A' });
    const userB = await createUser({ suffix: 'B' });
    const { livreId, exemplaireId } = await setupLivreEtExemplaire(admin);

    await request(app)
      .post('/api/emprunts')
      .set('Authorization', userA.authHeader)
      .send({ exemplaireIds: [exemplaireId] });

    await request(app)
      .post('/api/reservations')
      .set('Authorization', userB.authHeader)
      .send({ livreId });

    const res = await request(app)
      .post('/api/reservations')
      .set('Authorization', userB.authHeader)
      .send({ livreId });

    expect(res.status).toBe(409);
  });
});

describe('POST /api/reservations/:id/honorer — LE SWITCH', () => {
  it('convertit la reservation en emprunt et met exemplaire EMPRUNTE', async () => {
    const admin = await createUser({ role: 'admin' });
    const userA = await createUser({ suffix: 'A' });
    const userB = await createUser({ suffix: 'B' });
    const { livreId, exemplaireId } = await setupLivreEtExemplaire(admin);

    const empruntA = await request(app)
      .post('/api/emprunts')
      .set('Authorization', userA.authHeader)
      .send({ exemplaireIds: [exemplaireId] });

    const reservation = await request(app)
      .post('/api/reservations')
      .set('Authorization', userB.authHeader)
      .send({ livreId });

    await request(app)
      .patch(`/api/emprunts/${empruntA.body.id}/retourner`)
      .set('Authorization', userA.authHeader);

    const res = await request(app)
      .post(`/api/reservations/${reservation.body.id}/honorer`)
      .set('Authorization', userB.authHeader);

    expect(res.status).toBe(201);
    expect(res.body.statut).toBe('EN_COURS');
    expect(res.body.exemplaires[0].exemplaireId).toBe(exemplaireId);

    const resDB = await prisma.reservation.findUnique({ where: { id: reservation.body.id } });
    expect(resDB.statut).toBe('HONOREE');

    const ex = await prisma.exemplaire.findUnique({ where: { id: exemplaireId } });
    expect(ex.statut).toBe('EMPRUNTE');
  });

  it('refuse si la reservation est deja honoree -> 409', async () => {
    const admin = await createUser({ role: 'admin' });
    const userA = await createUser({ suffix: 'A' });
    const userB = await createUser({ suffix: 'B' });
    const { livreId, exemplaireId } = await setupLivreEtExemplaire(admin);

    const empruntA = await request(app)
      .post('/api/emprunts')
      .set('Authorization', userA.authHeader)
      .send({ exemplaireIds: [exemplaireId] });

    const reservation = await request(app)
      .post('/api/reservations')
      .set('Authorization', userB.authHeader)
      .send({ livreId });

    await request(app)
      .patch(`/api/emprunts/${empruntA.body.id}/retourner`)
      .set('Authorization', userA.authHeader);

    await request(app)
      .post(`/api/reservations/${reservation.body.id}/honorer`)
      .set('Authorization', userB.authHeader);

    const res = await request(app)
      .post(`/api/reservations/${reservation.body.id}/honorer`)
      .set('Authorization', userB.authHeader);

    expect(res.status).toBe(409);
  });

  it("refuse si la reservation appartient a un autre user -> 403", async () => {
    const admin = await createUser({ role: 'admin' });
    const userA = await createUser({ suffix: 'A' });
    const userB = await createUser({ suffix: 'B' });
    const userC = await createUser({ suffix: 'C' });
    const { livreId, exemplaireId } = await setupLivreEtExemplaire(admin);

    await request(app)
      .post('/api/emprunts')
      .set('Authorization', userA.authHeader)
      .send({ exemplaireIds: [exemplaireId] });

    const reservation = await request(app)
      .post('/api/reservations')
      .set('Authorization', userB.authHeader)
      .send({ livreId });

    const res = await request(app)
      .post(`/api/reservations/${reservation.body.id}/honorer`)
      .set('Authorization', userC.authHeader);

    expect(res.status).toBe(403);
  });
});

describe('DELETE /api/reservations/:id', () => {
  it("annule la reservation et remet l'exemplaire EMPRUNTE", async () => {
    const admin = await createUser({ role: 'admin' });
    const userA = await createUser({ suffix: 'A' });
    const userB = await createUser({ suffix: 'B' });
    const { livreId, exemplaireId } = await setupLivreEtExemplaire(admin);

    await request(app)
      .post('/api/emprunts')
      .set('Authorization', userA.authHeader)
      .send({ exemplaireIds: [exemplaireId] });

    const reservation = await request(app)
      .post('/api/reservations')
      .set('Authorization', userB.authHeader)
      .send({ livreId });

    const res = await request(app)
      .delete(`/api/reservations/${reservation.body.id}`)
      .set('Authorization', userB.authHeader);

    expect(res.status).toBe(200);

    const resDB = await prisma.reservation.findUnique({ where: { id: reservation.body.id } });
    expect(resDB.statut).toBe('ANNULEE');

    const ex = await prisma.exemplaire.findUnique({ where: { id: exemplaireId } });
    expect(ex.statut).toBe('EMPRUNTE');
  });

  it("refuse si la reservation n'appartient pas a l'user -> 403", async () => {
    const admin = await createUser({ role: 'admin' });
    const userA = await createUser({ suffix: 'A' });
    const userB = await createUser({ suffix: 'B' });
    const userC = await createUser({ suffix: 'C' });
    const { livreId, exemplaireId } = await setupLivreEtExemplaire(admin);

    await request(app)
      .post('/api/emprunts')
      .set('Authorization', userA.authHeader)
      .send({ exemplaireIds: [exemplaireId] });

    const reservation = await request(app)
      .post('/api/reservations')
      .set('Authorization', userB.authHeader)
      .send({ livreId });

    const res = await request(app)
      .delete(`/api/reservations/${reservation.body.id}`)
      .set('Authorization', userC.authHeader);

    expect(res.status).toBe(403);
  });
});

describe('GET /api/reservations/mes-reservations', () => {
  it("retourne uniquement les reservations de l'utilisateur connecte", async () => {
    const admin = await createUser({ role: 'admin' });
    const userA = await createUser({ suffix: 'A' });
    const userB = await createUser({ suffix: 'B' });
    const { livreId, exemplaireId } = await setupLivreEtExemplaire(admin);

    await request(app)
      .post('/api/emprunts')
      .set('Authorization', userA.authHeader)
      .send({ exemplaireIds: [exemplaireId] });

    await request(app)
      .post('/api/reservations')
      .set('Authorization', userB.authHeader)
      .send({ livreId });

    const resA = await request(app)
      .get('/api/reservations/mes-reservations')
      .set('Authorization', userA.authHeader);
    expect(resA.body).toHaveLength(0);

    const resB = await request(app)
      .get('/api/reservations/mes-reservations')
      .set('Authorization', userB.authHeader);
    expect(resB.body).toHaveLength(1);
  });
});
