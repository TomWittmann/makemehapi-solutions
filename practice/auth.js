/**
 * There isn't a direct concept of being logged in with basic auth like there is with cookie auth.
 * The browser here is remembering your credentials after the first entry.
 * 
 * You need to force the browser to purge its cache of the credentials.
 */

const Hapi = require('@hapi/hapi');
const Boom = require('@hapi/boom');
const Inert = require('@hapi/inert');

const users = 
    {
        tom: {
            username: 'tom',
            password: '1234'
        },
        greg: {
            username: 'greg',
            password: '4321'
        }
    }
;



const init = async () => {

    const server = Hapi.server({
        host: 'localhost',
        port: 1234
    });

    await server.register(require('@hapi/basic'));
    await server.register(Inert);

    // Create strategy.
    server.auth.strategy('loginStrategy', 'basic', {
        // Only one required option which is the validate function.
        validate: async (request, username, password) => {
            // request attempting to authenticate.
            const user = users[username];

            if (!user || password !== user.password) {
                console.log(user);
                console.log(typeof password);
                console.log("incorrect");
                return {isValid: false};
            } else {
                console.log(typeof password);
                console.log("correct");
                return {isValid: true, credentials: user};
            }

        }
    });

    server.route({
        method: 'GET',
        path: '/',
        handler: (request, h) => {
            
            if (request.auth.credentials) {
                // return h.redirect('/loggedIn');
                return h.file('home.html');
            } else {
                return "LOG IN AGAIN."
            }
            
        },
        options: {
            auth: 'loginStrategy'
        }
    });

    server.route({
        method: 'GET',
        path: '/logOut',
        handler: (request, h) => {
            return Boom.unauthorized("You have been logged out!");
        }
    })

    server.route({
        method: 'GET',
        path: '/loggedIn',
        handler: (request, h) => {
            return "LOGGED IN";
        }
    })

    await server.start();

}

init();