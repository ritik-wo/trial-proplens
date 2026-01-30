import Joi from 'joi';
import { joiResolver } from '@hookform/resolvers/joi';

export const textRequired = Joi.string().trim().min(1).required();
export const urlRequired = Joi.string().uri({ scheme: [/https?/] }).required();

export const resolverText = () => joiResolver(Joi.object({ value: textRequired }));
export const resolverUrl = (name = 'url') => joiResolver(Joi.object({ [name]: urlRequired }));
