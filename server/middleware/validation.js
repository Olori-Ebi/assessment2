const Joi = require('@hapi/joi');

exports.createUser = (payload) => {
    const schema = Joi.object({
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        address: Joi.string().required(),
        email: Joi.string().email().required(),
        lat: Joi.number().required(),
        long: Joi.number().required(),
        mobile: Joi.string().required(),
        password: Joi.string().required()
    });
    return schema.validate(payload, {allowUnknown: true});
};

exports.signIn = (payload) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required()
    });
    return schema.validate(payload, {allowUnknown: true});
};


exports.createProduct = (payload) => {
    const schema = Joi.object({
        name: Joi.string().required(),
        address: Joi.string().required(),
        image: Joi.string().required(),
        price: Joi.number().required(),
        lat: Joi.number().required(),
        long: Joi.number().required(),
        radius: Joi.number().required()
    });
    return schema.validate(payload, {allowUnknown: true});
};
