const Hapi = require('@hapi/hapi');

const init = async () => {

    const server = Hapi.Server({
        host: 'localhost',
        port: Number(process.argv[2]) || 8080
    });

    server.route({
        method: 'GET',
        path: '/',
        handler: (request, h) => {
            return "Hello hapi"
        }
    })

    await server.start();

    console.log('Server running at:', server.info.uri);

}

init();