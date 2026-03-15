import Joi from 'joi';

export const configValidationSchema = Joi.object({
  POSTGRES_HOST: Joi.string().required(),
  POSTGRES_PORT: Joi.number().default(5432),
  POSTGRES_USERNAME: Joi.string().required(),
  POSTGRES_PASSWORD: Joi.string().required(),
  POSTGRES_DB: Joi.string().required(),

  NODE_ENV: Joi.string()
    .valid('development', 'production')
    .default('development'),
  PORT: Joi.number().default(3001),

  JWT_ACCESS_TOKEN: Joi.string().required(),
  JWT_REFRESH_TOKEN: Joi.string().required(),

  DEFAULT_ADMIN_NAME: Joi.string().required(),
  DEFAULT_ADMIN_PASS: Joi.string().required(),
});
