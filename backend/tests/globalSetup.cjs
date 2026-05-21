// CJS obligatoire pour globalSetup avec "type":"module"
const { execSync } = require('child_process');

module.exports = async () => {
  // Chemin relatif au schema.prisma (dans prisma/) → test.db sera dans prisma/test.db
  execSync('npx prisma db push --accept-data-loss --skip-generate', {
    env: { ...process.env, DATABASE_URL: 'file:./test.db' },
    stdio: 'pipe',
  });
};
