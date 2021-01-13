
/**
 * This program creates a server exposing a login endpoint and replies with
 * login successful when an HTTP POST request is sent to /login.
 * 
 * By using a Joi object we can specify highly customizable validation rules in paths,
 * request payloads, and responses.
 * 
 * Note that I kept getting an error code of 500. This is because node version 15.5.0 is
 * not compatible with hapi 20.0.2. The issue was fixed by installing 14.15.3.
 * 
 */

const Hapi = require('@hapi/hapi');
/**
 * Note that @hapi/joi has deprecated and joi is used instead.
 */
const Joi = require('joi');


const init = async () => {

    const server = Hapi.Server({
        host: 'localhost',
        port: (Number(process.argv[2] || 8080))
    });

    /**
     * Need this or will get cannot set uncomplied validation rules without configuring a validator.
     * However, don't have to use this if you wrap your validator in a Joi.object.
     */
    // server.validator(Joi)

    server.route({
        method: 'POST',
        path: '/login',
        handler: (request, h) => {
            return "login successful";
        },
        options: {
            validate: {

                /**
                 * Values are optional by default. To disallow this behavior,
                 * you can set the schema to required().
                 */

                payload: Joi.object({
                    isGuest: Joi.boolean().required(),
                    username: Joi.string().when('isGuest', { is: false, then: Joi.required() }),
                    accessToken: Joi.string().alphanum(),
                    password: Joi.string().alphanum()
                })
                // Forbids the presence of accessToken whenever password is present and vice versa.
                .options({allowUnknown: true})                
                .without('password', 'accessToken')
            }
        }
    });

    await server.start();

}

init();