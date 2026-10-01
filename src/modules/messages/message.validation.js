import Joi from "joi";
import { generalFields } from "../../middleware/validation.middleware.js";

export const sendMessage = {
    params: Joi.object({ receiverId: generalFields.id.required() }).required(),
    body: Joi.object({ content: Joi.string().trim().min(1).max(1000).required() }).required(),
};

export const messageId = {
    params: Joi.object({ messageId: generalFields.id.required() }).required(),
};
