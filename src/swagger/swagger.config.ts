export const swaggerDocument = {
  swagger: '2.0',
  info: {
    title: '',
    description: '',
    version: '1.0'
  },
  produces: [
    'application/json'
  ],
  host: '',
  basePath: '/api',
  tags: [
    {
      name: 'Configuration',
      description: 'Endpoints'
    }
  ],
  paths: {
    '/configuration': {
      get: {
        tags: [
          'Configuration'
        ],
        description: 'Configuration get',
        parameters: [
          {
            in: 'query',
            name: 'fields',
            description: '',
            required: false
          }
        ],
        responses: {
          200: {
            description: 'Ok'
          },
          404: {
            description: 'Not Found'
          }
        }
      },
      post: {
        tags: [
          'Configuration'
        ],
        description: 'Configuration Post',
        parameters: [
          {
            in: 'body',
            name: 'body',
            description: '',
            required: true,
            schema: {
              $ref: '#/definitions/configuration'
            }
          }
        ],
        responses: {
          200: {
            description: 'Ok'
          },
          404: {
            description: 'Not Found'
          }
        }
      }
    },
    '/configuration/sync': {
      get: {
        tags: [
          'Configuration'
        ],
        description: 'Configuration sync with hazelcast',
        responses: {
          200: {
            description: 'Ok'
          },
          404: {
            description: 'Not Found'
          }
        }
      }
    }
  },
  definitions: {
    configuration: {
      type: 'object',
      properties: {
        'user.password.uppercase': {
          type: 'string',
          example: '5'
        }
      }
    }
  }
};
