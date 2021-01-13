/**
 * This server listens on a port for the authentication username hapi and
 * the password auth. When the authentication fails the server responds with an
 * HTTP 401 status code.
 * 
 * If the program works a 200 code is returned. If it doesn't work, a 401 error code is returned
 * saying Bad username or password.
 * 
 * Basic authentication is a simple way to protect access to your application
 * using only a username and password. There is no need for cookies, or sessions,
 * only a standard HTTP header.
 * 
 * The Hapi basic plugin is for basic authentication.
 * It is installed with npm install @hapi/basic.
 * 
 */

const Hapi = require('@hapi/hapi');

const user = { name: 'hapi', password: 'auth' };

/**
 * A user lookup and password validation function.
 * This function is required in the basic scheme.
 * username - the username received from the client.
 * password - the password received from the client.
 * 
 * This function returns an object { isValid, credentials, response }
 * where isValid = true if the username was found and the password matched.
 * Otherwise it is false.
 * 
 * credentials - a credentials object passed back to the application
 * in request.auth.credentials.
 * 
 * response is optional and can be used to redirect the client.
 * If response is provided, don't need to provide isValid or credentials.
 */
const validate = async (request, username, password, h) => {
    
    const isValid = username === user.name && password === user.password;

    return { isValid, credentials: { name: user.name } };

};

const init = async () => {

    const server = Hapi.Server({
        host: 'localhost',
        port: Number(process.argv[2]) || 8080
    });

    await server.register(require('@hapi/basic'));

    /**
     * Registers an authentication strategy.
     * 
     * name - strategy name. A strategy is a configured instance of a scheme with an assigned name. Strategies
     * exist so you can use the same scheme several times in a slightly different way. 
     * For instance, might decide to you want use basic authentication in your app. For some routes you might wish to validate a user’s 
     * passwords against a value in a database and for some other routes, you might wish to check the 
     * password against a value stored in a text file. In this case you can create 2 different strategies from the scheme.
     * 
     * scheme - the scheme name. A scheme is a general type of authentication. Basic authentication and digest 
     * authentication are different types of authentication and in hapi each would be a different scheme.
     * A scheme isn't used directly to authenticate users, instead you create a specific strategy from the scheme.
     * 
     * options - options based on scheme requirements.
     * 
     * Digest authenication communicates credentials in an encrypted form by applying a hash function to the
     * username, password, etc. The purpose of encryption is to transform data in order to keep it secret from others.
     * 
     * Basic authentication uses non-encrypted base64 encoding. Thus, basic authentication should only be used where
     * transport layer security is provided such as https. The purpose of encoding is to transform data so that it can
     * be properly consumed by a different type of system.
     */

    server.auth.strategy('simple', 'basic', { validate });

    /**
     * Sets a default strategy which is applied to every route.
     * options - a string with the default strategy name.
     */

    server.auth.default('simple');

    server.route({
        method: 'GET',
        path: '/',
        handler: (request, h) => {
            return "Hello!";
        }
    })

    await server.start();

    console.log('Server running at:', server.info.uri);

}

init().catch((err) => {
    console.log(err);
})