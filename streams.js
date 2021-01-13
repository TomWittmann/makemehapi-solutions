
/**
 * This program creates a hapi server which responds to GET requests
 * to / by streaming a ROT13'd version of a file.
 * 
 * The file is rot13.txt and it contains "the pursuit of Hapi-ness"
 * 
 * The hapi handler returns a stream.
 * 
 * I had to install rot13-transform with npm install rot13-transform.
 * 
 * rot 13 is a letter substitution cipher that replaces a letter with the
 * 13th letter after it in the alphabet.
 */

const Hapi = require('@hapi/hapi');
const Path = require('path');
const fs = require('fs');
const rot13 = require('rot13-transform');

const init = async () => {

    const server = Hapi.Server({
        host: 'localhost',
        port: (Number(process.argv[2] || 8080))
    });

    server.route({
        method: 'GET',
        path: '/',
        handler: (request, h) => {
            /**
             * createReadStream opens up a readable stream.
             * path.join joins the specified path segments into one path. => __dirname/rot13.txt
             * pipe() feeds a readable stream into a writable stream so the contents are incrementally
             * read from the readable stream.
             * 
             */
            return fs.createReadStream(Path.join(__dirname, 'rot13.txt')).pipe(rot13());
        }
    });

    await server.start();

}

init();