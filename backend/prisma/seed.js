import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const catalogue = [
  {
    livre: {
      titre: 'Le Petit Prince',
      auteur: 'Antoine de Saint-Exupéry',
      isbn: '9782070612758',
      annee: 1943,
      editeur: 'Gallimard',
      collection: 'Folio Junior',
      categorie: 'JEUNESSE',
      imageUrl: 'https://covers.openlibrary.org/b/isbn/9782070612758-L.jpg',
    },
    exemplaires: ['LP-001', 'LP-002', 'LP-003'],
  },
  {
    livre: {
      titre: '1984',
      auteur: 'George Orwell',
      isbn: '9780451524935',
      annee: 1949,
      editeur: 'Signet Classic',
      categorie: 'SCIENCE_FICTION',
      imageUrl: 'https://covers.openlibrary.org/b/isbn/9780451524935-L.jpg',
    },
    exemplaires: ['OR-001', 'OR-002'],
  },
  {
    livre: {
      titre: "Harry Potter à l'école des sorciers",
      auteur: 'J.K. Rowling',
      isbn: '9782070541270',
      annee: 1997,
      editeur: 'Gallimard',
      collection: 'Folio Junior',
      categorie: 'FANTASY',
      imageUrl: 'https://covers.openlibrary.org/b/isbn/9782070541270-L.jpg',
    },
    exemplaires: ['HP-001', 'HP-002', 'HP-003'],
  },
  {
    livre: {
      titre: 'Dune',
      auteur: 'Frank Herbert',
      isbn: '9780441013593',
      annee: 1965,
      editeur: 'Ace Books',
      categorie: 'SCIENCE_FICTION',
      imageUrl: 'https://covers.openlibrary.org/b/isbn/9780441013593-L.jpg',
    },
    exemplaires: ['DU-001', 'DU-002'],
  },
  {
    livre: {
      titre: 'Clean Code',
      auteur: 'Robert C. Martin',
      isbn: '9780132350884',
      annee: 2008,
      editeur: 'Prentice Hall',
      categorie: 'INFORMATIQUE',
      imageUrl: 'https://covers.openlibrary.org/b/isbn/9780132350884-L.jpg',
    },
    exemplaires: ['CC-001', 'CC-002'],
  },
  {
    livre: {
      titre: "L'Alchimiste",
      auteur: 'Paulo Coelho',
      isbn: '9782290004449',
      annee: 1988,
      editeur: "J'ai Lu",
      categorie: 'ROMAN',
      imageUrl: 'https://covers.openlibrary.org/b/isbn/9782290004449-L.jpg',
    },
    exemplaires: ['AL-001', 'AL-002'],
  },
  {
    livre: {
      titre: 'Sapiens',
      auteur: 'Yuval Noah Harari',
      isbn: '9782226257017',
      annee: 2011,
      editeur: 'Albin Michel',
      categorie: 'HISTOIRE',
      imageUrl: 'https://covers.openlibrary.org/b/isbn/9782226257017-L.jpg',
    },
    exemplaires: ['SA-001'],
  },
  {
    livre: {
      titre: 'Atomic Habits',
      auteur: 'James Clear',
      isbn: '9780735211292',
      annee: 2018,
      editeur: 'Avery',
      categorie: 'DEVELOPPEMENT_PERSONNEL',
      imageUrl: 'https://covers.openlibrary.org/b/isbn/9780735211292-L.jpg',
    },
    exemplaires: ['AH-001', 'AH-002'],
  },
  {
    livre: {
      titre: "L'Étranger",
      auteur: 'Albert Camus',
      isbn: '9782070360024',
      annee: 1942,
      editeur: 'Gallimard',
      collection: 'Folio',
      categorie: 'ROMAN',
      imageUrl: 'https://covers.openlibrary.org/b/isbn/9782070360024-L.jpg',
    },
    exemplaires: ['ET-001', 'ET-002'],
  },
  {
    livre: {
      titre: 'Les Misérables',
      auteur: 'Victor Hugo',
      isbn: '9782070409228',
      annee: 1862,
      editeur: 'Gallimard',
      collection: 'Folio',
      categorie: 'ROMAN',
      imageUrl: 'https://covers.openlibrary.org/b/isbn/9782070409228-L.jpg',
    },
    exemplaires: ['LM-001', 'LM-002'],
  },
];

async function main() {
  console.log('--- Début du Seeding ---');

  await prisma.reservation.deleteMany();
  await prisma.empruntExemplaire.deleteMany();
  await prisma.emprunt.deleteMany();
  await prisma.exemplaire.deleteMany();
  await prisma.livre.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.user.deleteMany();

  const adminPassword = await bcrypt.hash('admin123', 10);
  const userPassword = await bcrypt.hash('user123', 10);

  await prisma.user.create({
    data: { nom: 'Admin Biblio', email: 'admin@bibliotheque.fr', password: adminPassword, role: 'admin' },
  });
  await prisma.user.create({
    data: { nom: 'Jean Dupont', email: 'jean@exemple.fr', password: userPassword, role: 'user' },
  });

  console.log('✅ Utilisateurs : admin@bibliotheque.fr / jean@exemple.fr');

  for (const { livre, exemplaires } of catalogue) {
    const livreCreé = await prisma.livre.create({ data: livre });
    for (const codeBarre of exemplaires) {
      await prisma.exemplaire.create({ data: { codeBarre, livreId: livreCreé.id } });
    }
  }

  console.log(`✅ ${catalogue.length} livres et leurs exemplaires créés.`);
  console.log('--- Seeding terminé ---');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
