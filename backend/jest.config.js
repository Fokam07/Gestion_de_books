export default {
  testEnvironment: 'node',
  transform: {},                          // Pas de transpilation — on garde l'ESM natif
  globalSetup: './tests/globalSetup.cjs', // Crée test.db avant tous les tests
  testMatch: ['**/tests/**/*.test.js'],
};
