/**
 * This file creates a server with an endpoint that accepts an uploaded file to the /upload path.
 * The endpoint /upload accepts the keys description and file.
 * 
 */

const Hapi = require('@hapi/hapi');

const init = async () => {

    const server = Hapi.Server({
        host: 'localhost',
        port: Number(process.argv[2]) || 8080
    });

    server.route({
        method: 'POST',
        path: '/upload',
        handler: (request, h) => new Promise((resolve, reject) => {
            let body = '';

            request.payload.file.on('data', (data) => {
              body += data;
            });

            request.payload.file.on('end', () => {
              const result = {
                description: request.payload.description,
                file: {
                  data: body,
                  filename: request.payload.file.hapi.filename,
                  headers: request.payload.file.hapi.headers
                }
              };

              return resolve(JSON.stringify(result));
            });

            request.payload.file.on('error', err => reject(err));
          }),
        /**
         * We can get a file as a readable stream by adding this.
         * To accept a file as input, the request should use the multipart/form-data header.
         * Setting output to stream and parse to true allows you to get an file as a readable stream.
         */
        options: {
            payload: {
                // Default value is data.
                output: 'stream',
                parse: true,
                // Allows entire files to be included in the data.
                allow: 'multipart/form-data',
                multipart: true
            }
        }
    });

    await server.start();

    console.log('Server running at:', server.info.uri);

}

init();