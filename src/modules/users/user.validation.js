import Joi from "joi";
import { genderEnum } from "../../common/enums.js";
import { generalFields } from "../../middleware/validation.middleware.js";

export const signUp = {
    body: Joi.object({
        fName: Joi.string().trim().min(2).max(20).required(),
        lName: Joi.string().trim().min(2).max(20).required(),
        email: generalFields.email.required(),
        password: generalFields.password.required(),
        cPassword: Joi.string().valid(Joi.ref("password")).required().messages({
            "any.only": "cPassword must match password",
        }),
        age: Joi.number().integer().min(20).max(60).required(),
        gender: Joi.string().valid(...Object.values(genderEnum)),
        phone: generalFields.phone,
    }).required(),
};

export const signIn = {
    body: Joi.object({
        email: generalFields.email.required(),
        password: Joi.string().required(),
    }).required(),
};

export const updateProfile = {
    body: Joi.object({
        fName: Joi.string().trim().min(2).max(20),
        lName: Joi.string().trim().min(2).max(20),
        age: Joi.number().integer().min(20).max(60),
        gender: Joi.string().valid(...Object.values(genderEnum)),
        phone: generalFields.phone,
    }).min(1).required(),
};

export const updatePassword = {
    body: Joi.object({
        oldPassword: Joi.string().required(),
        newPassword: generalFields.password.required(),
        cPassword: Joi.string().valid(Joi.ref("newPassword")).required().messages({
            "any.only": "cPassword must match newPassword",
        }),
    }).required(),
};

export const profileImage = {
    file: generalFields.file.required(),
};

export const coverImages = {
    files: Joi.array().items(generalFields.file).min(1).max(5).required(),
};

export const profileFiles = {
    files: Joi.object({
        profileImage: Joi.array().items(generalFields.file).length(1).required(),
        coverImages: Joi.array().items(generalFields.file).min(1).max(5),
    }).required(),
};

export const shareProfile = {
    params: Joi.object({ userId: generalFields.id.required() }).required(),
};
