import swaggerJsdoc from 'swagger-jsdoc';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Bracketifier',
            version: '1.0.0',
            description: 'Tournament bracket maker',
        },
        servers: [
            {
                url: 'http://localhost:3000',
            },
        ],
    },
    apis: ['src/**/*.routes.ts'],
};

export const specs = swaggerJsdoc(options);
