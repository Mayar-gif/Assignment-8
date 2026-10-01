import Joi from "joi";

export const generalFields = {
    id: Joi.string().hex().length(24),
    email: Joi.string().email({ tlds: { allow: false } }).trim().lowercase(),
    password: Joi.string().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/).messages({
        "string.pattern.base": "password must be at least 8 chars with upper, lower case letters and a number",
    }),
    phone: Joi.string().pattern(/^(002|\+2)?01[0125][0-9]{8}$/).messages({
        "string.pattern.base": "phone must be a valid Egyptian number",
    }),
};

export const validation = (schema) => {
    return (req, res, next) => {
        const errors = [];
        for (const key of Object.keys(schema)) {
            const { error, value } = schema[key].validate(req[key] ?? {}, { abortEarly: false });
            if (error) {
                errors.push(...error.details.map((d) => ({ in: key, path: d.path.join("."), message: d.message })));
            } else if (key === "body") {
                req.body = value; 
            }
        }
        if (errors.length) {
            const err = new Error("Validation error", { cause: 400 });
            err.details = errors;
            throw err;
        }
        next();
    };
};
