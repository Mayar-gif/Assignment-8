import Joi from "joi";
import { removeUploaded } from "../utils/multer/file.service.js";

export const generalFields = {
    id: Joi.string().hex().length(24),
    email: Joi.string().email({ tlds: { allow: false } }).trim().lowercase(),
    password: Joi.string().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/).messages({
        "string.pattern.base": "password must be at least 8 chars with upper, lower case letters and a number",
    }),
    file: Joi.object({
        fieldname: Joi.string().required(),
        originalname: Joi.string().required(),
        encoding: Joi.string().required(),
        mimetype: Joi.string().required(),
        size: Joi.number().positive().required(),
        destination: Joi.string(),
        filename: Joi.string(),
        path: Joi.string(),
        buffer: Joi.binary(),
    }),
    phone: Joi.string().pattern(/^(002|\+2)?01[0125][0-9]{8}$/).messages({
        "string.pattern.base": "phone must be a valid Egyptian number",
    }),
};

export const validation = (schema) => {
    return async (req, res, next) => {
        const errors = [];
        for (const key of Object.keys(schema)) {
            const isFileKey = key === "file" || key === "files";
            const { error, value } = schema[key].validate(req[key] ?? (isFileKey ? undefined : {}), { abortEarly: false });
            if (error) {
                errors.push(...error.details.map((d) => ({ in: key, path: d.path.join("."), message: d.message })));
            } else if (key === "body") {
                req.body = value; 
            }
        }
        if (errors.length) {
            await removeUploaded(req);
            const err = new Error("Validation error", { cause: 400 });
            err.details = errors;
            throw err;
        }
        next();
    };
};
