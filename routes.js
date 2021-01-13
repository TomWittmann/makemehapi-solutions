
/**
 * This program is a server that listens on a port passed from the command line
 * and outputs Hello [name] where name is replaced with the path parameter
 * supplied to GET /makemehapi.
 */

const Hapi = require('@hapi/hapi');

const init = async () => {

    const server = Hapi.Server({
        host: 'localhost',
        port: (Number(process.argv[2] || 8080))
    });

    /**
     * 
     */

    server.route({
        method: 'GET',
        path: '/{name?}',
        handler: (request, h) => {
            return `Hello ${encodeURIComponent(request.params.name)}`
        }
    });

    await server.start();

}

init();