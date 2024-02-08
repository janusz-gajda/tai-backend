const swaggerAutogen = require('swagger-autogen')({openapi: '3.0.0'})

const docs = {
    info: {
        title: 'tai-backend'
    },
    tags: [
        {
            name: 'Permission',
            description: ''
        },
        {
            name: 'Song',
            description: ''
        },
        {
            name: 'SongsCollection',
            description: ''
        },
        {
            name: 'SharedContent',
            description: ''
        },
        {
            name: 'User',
            description: ''
        },
    ],
    components: {
        schemas: {
            Permission: {
                $name: 'permission name',
                description: 'permission description'
            }
        }
    }
}

const outputFile = './docs/backend-server-api.json'
const routes = ['./src/controllers/expressController.ts']

swaggerAutogen(outputFile, routes, docs)
