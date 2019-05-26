import Joi from 'joi';

const validateCar = Joi.object({
	owner: Joi.number().integer().required(),
	manufacture: Joi.string().alphanum().min(3).required(),
	model: Joi.string().min(3).required(),
	price: Joi.number().precision(4).positive().min(2).required(),
	state: Joi.string().min(3).required(),
	body_type: Joi.string().min(3).required(),
	description: Joi.string().max(150).required(),
})

module.exports = { validateCar };