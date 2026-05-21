import request from 'supertest';
import app from '../src/app.js';
import { clearDatabase, prisma } from './helpers/db.js';
import { createUser } from './helpers/auth.js';

afterAll(() => prisma.$disconnect());
beforeEach(clearDatabase);

const LIVRE = { titre: 'Dune', auteur: 'Frank Herbert', annee: 1965, categorie: 'SCIENCE_FICTION' };

describe('GET /api/livres', () => {
  it('retourne un tableau (vide au depart)', async () => {
    const res = await request(app).get('/api/livres');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

describe('POST /api/livres', () => {
  it('cree un livre (user authentifie)', async () => {
    const { authHeader } = await createUser();
    const res = await request(app)
      .post('/api/livres')
      .set('Authorization', authHeader)
      .send(LIVRE);
    expect(res.status).toBe(201);
    expect(res.body.titre).toBe(LIVRE.titre);
    expect(res.body.categorie).toBe('SCIENCE_FICTION');
  });

  it('accepte une categorie valide', async () => {
    const { authHeader } = await createUser();
    const res = await request(app)
      .post('/api/livres')
      .set('Authorization', authHeader)
      .send({ titre: 'Sherlock Holmes', auteur: 'Conan Doyle', categorie: 'POLICIER' });
    expect(res.status).toBe(201);
    expect(res.body.categorie).toBe('POLICIER');
  });

  it('refuse une categorie invalide -> 400', async () => {
    const { authHeader } = await createUser();
    const res = await request(app)
      .post('/api/livres')
      .set('Authorization', authHeader)
      .send({ ...LIVRE, categorie: 'GENRE_INEXISTANT' });
    expect(res.status).toBe(400);
  });

  it('cree un livre sans categorie (champ optionnel)', async () => {
    const { authHeader } = await createUser();
    const { categorie: _, ...livresSansCategorie } = LIVRE;
    const res = await request(app)
      .post('/api/livres')
      .set('Authorization', authHeader)
      .send(livresSansCategorie);
    expect(res.status).toBe(201);
    expect(res.body.categorie).toBeNull();
  });

  it('accepte une imageUrl valide', async () => {
  const { authHeader } = await createUser();
  const res = await request(app)
    .post('/api/livres')
    .set('Authorization', authHeader)
    .send({ ...LIVRE, imageUrl: 'https://covers.example.com/dune.jpg' });
  expect(res.status).toBe(201);
  expect(res.body.imageUrl).toBe('https://covers.example.com/dune.jpg');
  });

  it('refuse une imageUrl invalide -> 400', async () => {
    const { authHeader } = await createUser();
    const res = await request(app)
      .post('/api/livres')
      .set('Authorization', authHeader)
      .send({ ...LIVRE, imageUrl: 'pas-une-url' });
    expect(res.status).toBe(400);
  });

  it('refuse sans authentification -> 401', async () => {
    const res = await request(app).post('/api/livres').send(LIVRE);
    expect(res.status).toBe(401);
  });

  it('refuse un body invalide -> 400', async () => {
    const { authHeader } = await createUser();
    const res = await request(app)
      .post('/api/livres')
      .set('Authorization', authHeader)
      .send({ titre: '' });
    expect(res.status).toBe(400);
  });
});

describe('DELETE /api/livres/:id', () => {
  it('supprime un livre (admin)', async () => {
    const admin = await createUser({ role: 'admin' });
    const creer = await request(app)
      .post('/api/livres')
      .set('Authorization', admin.authHeader)
      .send(LIVRE);

    const res = await request(app)
      .delete(`/api/livres/${creer.body.id}`)
      .set('Authorization', admin.authHeader);
    expect(res.status).toBe(204);
  });

  it('refuse pour un user non-admin -> 403', async () => {
    const admin = await createUser({ role: 'admin' });
    const user = await createUser({ suffix: 'u2' });
    const creer = await request(app)
      .post('/api/livres')
      .set('Authorization', admin.authHeader)
      .send(LIVRE);

    const res = await request(app)
      .delete(`/api/livres/${creer.body.id}`)
      .set('Authorization', user.authHeader);
    expect(res.status).toBe(403);
  });
});

describe('Exemplaires', () => {
  let admin, livreId;

  beforeEach(async () => {
    admin = await createUser({ role: 'admin' });
    const res = await request(app)
      .post('/api/livres')
      .set('Authorization', admin.authHeader)
      .send(LIVRE);
    livreId = res.body.id;
  });

  it('ajoute un exemplaire (admin) -> 201', async () => {
    const res = await request(app)
      .post(`/api/livres/${livreId}/exemplaires`)
      .set('Authorization', admin.authHeader)
      .send({ codeBarre: 'EX-001' });
    expect(res.status).toBe(201);
    expect(res.body.codeBarre).toBe('EX-001');
    expect(res.body.statut).toBe('DISPONIBLE');
  });

  it("refuse l'ajout pour un user non-admin -> 403", async () => {
    const user = await createUser({ suffix: 'u2' });
    const res = await request(app)
      .post(`/api/livres/${livreId}/exemplaires`)
      .set('Authorization', user.authHeader)
      .send({ codeBarre: 'EX-001' });
    expect(res.status).toBe(403);
  });

  it("retourne la liste des exemplaires d'un livre", async () => {
    await request(app)
      .post(`/api/livres/${livreId}/exemplaires`)
      .set('Authorization', admin.authHeader)
      .send({ codeBarre: 'EX-001' });

    const res = await request(app)
      .get(`/api/livres/${livreId}/exemplaires`)
      .set('Authorization', admin.authHeader);
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
  });

  it('refuse un livre inexistant -> 404', async () => {
    const res = await request(app)
      .post('/api/livres/9999/exemplaires')
      .set('Authorization', admin.authHeader)
      .send({ codeBarre: 'EX-999' });
    expect(res.status).toBe(404);
  });
});
