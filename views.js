/**
 * This server responds to requests to /?name=Handling using a template located at
 * templates/index.html.
 * 
 * Vision is a hapi plugin for rendering templates. The view key in handler is used
 * to define the template to be used to generate the response.
 */

const Hapi = require('@hapi/hapi');
const Path = require('path');

const init = async () => {

    const server = Hapi.Server({
        host: 'localhost',
        port: (Number(process.argv[2] || 8080))
    });

    /**
     * If you don't register before using the module you will get an error.
     * This happened to me with the file key in handler.
     */

    await server.register(require('@hapi/vision'));

     /**
      * server.views() is the server method to configure the templates used on the server.
      * You can also set the directory path for your templates.
      * Here, all view files will be searched for under the templates directory.
      */

    server.views({
        engines: {
            html: require('handlebars')
        },
        path: Path.join(__dirname, 'templates')
    });

    /**
     * The template receives some information from the request. For example, the
     * query parameters that were passed in via the URL are available in the 
     * query object and can be used in the template.
     * In the index.html file the argument used is {{query.name}}
     * 
     */

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