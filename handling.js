
/**
 * This server responds to requests to / with a static HTML file named
 * index.html.
 */

const Hapi = require('@hapi/hapi');

const init = async () => {

    const server = Hapi.Server({
        host: 'localhost',
        port: (Number(process.argv[2] || 8080))
    });

    /**
     * Inert is a hapi plugin for serving static files and directories.
     * You can declare the handler as an object instead of a function.
     * The object must contain the file key when using inert.
     */

    await server.register(require('@hapi/inert'));

    server.route({
        method: 'GET',
        path: '/',
        handler: {
            file: "index.html"
        }
    });

    await server.start();

}

init();