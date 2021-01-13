
/**
 * This server responds to requests to /foo/bar/baz/file.html to a file in
 * the directory public/file.html.
 */

const Hapi = require('@hapi/hapi');
const Path = require('path');

const init = async () => {

    const server = Hapi.Server({
        host: 'localhost',
        port: (Number(process.argv[2] || 8080))
    });

    /**
     * Inert is a hapi plugin for serving static files and directories.
     * You can declare the handler as an object instead of a function.
     * The object must contain the file key when using inert.
     * The object can also contain the directory key which is the directory
     * housing the static files.
     */

    await server.register(require('@hapi/inert'));

    /**
     * Routes using the directory handler must include a path parameter
     * at the end of the path string. The parameter name does not matter.
     */
    server.route({
        method: 'GET',
        path: '/foo/bar/baz/{param}',
        handler: {
            directory: {
                path: Path.join(__dirname, 'public')
            }
        }
    });

    await server.start();

}

init();