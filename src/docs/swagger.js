import swaggerJSDoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Bibliothèque Sécurisée',
      version: '1.0.0',
      description: 'Documentation de l\'API avec JWT et Refresh Tokens',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./src/routes/*.js'], // Va chercher les annotations dans les fichiers de routes
};

export const swaggerSpec = swaggerJSDoc(options);