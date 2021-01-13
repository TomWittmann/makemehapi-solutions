
/**
 * This program is a server that responds to requests to
 * /?name=Helping&suffix=! using the template form the VIEWS exercise.
 * 
 * However, instead of placing the query parameter directly in the template,
 * a helper is created at helper/helper.js to output the name query
 * parameter.
 * 
 * The helper concatenates the name and suffix query parameters.
 * 
 * Helpers are functions used within templates to perform transformations
 * and other data manipulations using the template context or other inputs.
 * 
 * You can define a helper's path in the server options. All .js files in this
 * directory will be loaded and the file name will be used as the helper name.
 * 
 * Each helper js file must export a single method with the signature function(context)
 * and return a string.
 */

const Hapi = require('@hapi/hapi');
const Path = require('path');

const init = async () => {

    const server = Hapi.Server({
        host: 'localhost',
        port: (Number(process.argv[2] || 8080))
    });

    await server.register(require('@hapi/vision'));

    server.views({
        engines: {
            html: require('handlebars')
        },
        path: Path.join(__dirname, 'templates'),
        helpersPath: Path.resolve(__dirname, 'helpers')
    });

    server.route({
        method: 'GET',
        path: '/',
        handler: {
            view: 'index.html'
        }
    });

    await server.start();

}

init();