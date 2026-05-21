export const errorHandler = (err, req, res, next) => {
  // 1. Log de l'erreur pour le développeur (Console)
  console.error(`[ERROR] ${req.method} ${req.url} :`, err.message);

  // 2. Gestion des erreurs de validation (Zod)
  if (err.name === 'ZodError') {
    return res.status(400).json({
      error: 'Validation Error',
      details: err.errors.map(e => ({ path: e.path, message: e.message }))
    });
  }

  // 3. Gestion des erreurs Prisma (Sécurité : on ne renvoie pas les codes P2002, etc.)
  if (err.code && err.code.startsWith('P')) {
    const statusCode = err.code === 'P2025' ? 404 : 400;
    return res.status(statusCode).json({
      error: 'Database Error',
      message: 'Une opération sur la base de données a échoué.' 
      // On cache le message technique err.message en production
    });
  }

  // 4. Gestion des erreurs JWT
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'Unauthorized', message: 'Token invalide' });
  }
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ error: 'Unauthorized', message: 'Token expiré' });
  }

  // 5. Erreur générique (Fallback)
  const status = err.status || 500;
  const message = process.env.NODE_ENV === 'production' 
    ? 'Une erreur interne est survenue' 
    : err.message;

  res.status(status).json({
    error: status === 500 ? 'Internal Server Error' : 'Error',
    message: message
  });
};