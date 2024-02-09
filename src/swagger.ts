const swaggerAutogen = require('swagger-autogen')({openapi: '3.0.0'})

const docs = {
    info: {
        title: 'tai-backend'
    },
    tags: [
        {
            name: 'Permission'
        },
        {
            name: 'Song'
        },
        {
            name: 'SongsCollection'
        },
        {
            name: 'SharedContent'
        },
        {
            name: 'User'
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
