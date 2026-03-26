
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Début du Seeding ---');

  // 1. Nettoyage de la base (Optionnel mais recommandé en dev)
  await prisma.refreshToken.deleteMany();
  await prisma.livre.deleteMany();
  await prisma.user.deleteMany();

  // 2. Création des utilisateurs
  const adminPassword = await bcrypt.hash('admin123', 10);
  const userPassword = await bcrypt.hash('user123', 10);

  const admin = await prisma.user.create({
    data: {
      nom: 'Admin Biblio',
      email: 'admin@test.com',
      password: adminPassword,
      role: 'admin',
    },
  });

  const user = await prisma.user.create({
    data: {
      nom: 'Jean Dupont',
      email: 'jean@test.com',
      password: userPassword,
      role: 'user',
    },
  });

  console.log('✅ Utilisateurs créés : admin@test.com / user@test.com');

  // 3. Création des livres
  // 3. Création des livres (Adapté à ton schéma réel)
  const livres = [
    { 
      titre: 'Le Petit Prince', 
      auteur: 'Antoine de Saint-Exupéry', 
      annee: 1943, 
      genre: 'Conte',
      disponible: true 
    },
    { 
      titre: '1984', 
      auteur: 'George Orwell', 
      annee: 1949, 
      genre: 'Dystopie',
      disponible: true 
    },
    { 
      titre: 'Clean Code', 
      auteur: 'Robert C. Martin', 
      annee: 2008, 
      genre: 'Informatique',
      disponible: true 
    }
  ];

  for (const livre of livres) {
    await prisma.livre.create({ data: livre });
  }

  console.log(`✅ ${livres.length} livres ajoutés au catalogue.`);
  console.log('--- Seeding terminé avec succès ---');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });