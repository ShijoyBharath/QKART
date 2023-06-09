const Joi = require("joi");
const { password } = require("./custom.validation");

// TODO: CRIO_TASK_MODULE_AUTH - Define request validation schema for user registration
/**
 * Check request *body* for fields (all are *required*)
 * - "email" : string and satisyfing email structure
 * - "password": string and satisifes the custom password structure defined in "src/validations/custom.validation.js"
 * - "name": string
 */
const register = {
  body:Joi.object().keys({
    email:Joi.string().email().required(),
    password:Joi.string().custom(password,"Password validation").required(),
    name:Joi.string().required()  
  })
};


const login = {
  body:Joi.object().keys({
    email:Joi.string().email().required(),
    password:Joi.string().custom(password,"Password validation").required()
  })
};

module.exports = {
  register,
  login,
};
