/**
 * This program creates a server that has routes /set-cookie and /check-cookie.
 * The set-cookie endpoint sets a cookie with the key session and the value { key: 'makemehapi' }
 * The cookie is base64json encoded, expires in 10ms, and has a domain scope of localhost.
 * 
 * The check-cookie endpoing has cookies received form the /set-cookie endpoint.
 * If the session key is present in cookies then {user: 'hapi'} is returned.
 * Otherwise an unauthorized access error is returned.
 * 
 * When writing a web application, cookies are often used to keep state about a user between requests.
 * 
 */


const Hapi = require('@hapi/hapi');
const Boom = require('@hapi/boom');

const init = async () => {

    const server = Hapi.Server({
        host: 'localhost',
        port: Number(process.argv[2]) || 8080
    });

    /**
     * To prepare a cookie, you first need to name it and configure a list of options,
     * This is done with server.state(name, [options]). Here, name is the name of the cookie and options
     * is an object used to configure the cookie.
     * 
     * It should be noted that the default settings for options are good for most cases and don't need to be configured.
     * 
     * Path provides a way to manage cookies for a specific url path.
     */

    server.state('session', {
        path: '/',
        encoding: 'base64json',
        ttl: 10,
        domain: 'localhost',
        isSameSite: false,
        isSecure: false,
        isHttpOnly: false
    });

    server.route({
        method: 'GET',
        path: '/set-cookie',
        handler: (request, h) => {
            h.state('session', { key: 'makemehapi' });
            return h.response('Hello!');
        },
        /**
         * You can also configure cookie behavior at a route level
         * by specifying two properties at the route's options.state object.
         * 
         * Note that configurations to cookies on the route level are in addition to
         * those configurations made by server.state.
         * 
         * parse - determines if cookies are parsed and stored in request.state.
         * failAction - determines how cookie parsing errors will be handled.
         */
        options: {
            state: {
                parse: true,
                failAction: 'log'
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/check-cookie',
        handler: (request, h) => {
            if (request.state.session) {
                return { user: 'hapi' };
            } else {
                return Boom.unauthorized();
            }
        },
        options: {
            state: {
                parse: true,
                failAction: 'log'
            }
        }
    });

    await server.start();

    console.log('Server running at:', server.info.uri);

}

init();