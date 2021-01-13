
/**
 * A proxy lets you relay requests from one server/service to another.
 * To use a proxy in hapi you use the h202 module which handles proxies.
 * 
 * This program listens on a port passed from the command line and takes
 * any requests to the path /proxy and proxies them to
 * http://localhost:65535/proxy
 */

const Hapi = require('@hapi/hapi');

const init = async () => {

    const server = Hapi.Server({
        host: 'localhost',
        port: (Number(process.argv[2] || 8080))
    });

    await server.register(require('h2o2'));

    server.route({
        method: 'GET',
        path: '/proxy',
        handler: {
            proxy: {
                host: '127.0.0.1',
                port: 65535
            }
        }
    });

    await server.start();

}

init();