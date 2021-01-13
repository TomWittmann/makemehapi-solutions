
/**
 * This program validates input using joi. Route configuration offers lots of ways to customize 
 * each endpoint offered by your hapi application. The solution just checks that a validation
 * object exists within the configurations for breed, not any specific validation.
 * 
 * Validation can happen in parameters in the path, in inbound payload validation,
 * and outbound response.
 * 
 * Objects for validation are defined in the Joi validation framework. npm install joi.
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
    // server.validator(Joi);

    server.route({
        method: 'GET',
        path: '/chickens/{breed?}',
        handler: (request, h) => {
            return `You asked for the chicken ${request.params.breed}`;
        },
        options: {
            validate: {

                /**
                 * Values are optional by default. To disallow this behavior,
                 * you can set the schema to required().
                 */
                params:
                    Joi.object({
                        breed: Joi.string().required()
                    })
            }
        }
    });

    await server.start();

}

init();