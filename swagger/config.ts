export default {
  definition: {
    schemes: ['http'],
    basePath: '/',
    info: {
      title: 'Admin api',
      version: '1.0',
    },
    securityDefinitions: {
      ApiKeyAuth: {
        type: 'apiKey',
        in: 'header',
        name: 'boauth',
      },
      basicAuth: {
        type: 'basic',
      },
    },
  },
};
