import userModel from "../../DB/models/user.model.js";
import messageModel from "../../DB/models/message.model.js";
import * as dbService from "../../DB/db.service.js";
import { successResponse } from "../../common/response.js";
import { providerEnum } from "../../common/enums.js";
import { generateHash, compareHash } from "../../utils/security/hash.js";
import { encrypt, decrypt } from "../../utils/security/encryption.js";
import { createLoginCredentials } from "../../utils/security/token.js";

const toUserResponse = (user) => ({
    _id: user._id,
    fName: user.fName,
    lName: user.lName,
    fullName: user.fullName,
    email: user.email,
    age: user.age,
    gender: user.gender,
    phone: user.phone ? decrypt(user.phone) : undefined,
    role: user.role,
    profileImage: user.profileImage,
    isConfirmed: user.isConfirmed,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
});

export const signUp = async (req, res) => {
    const { fName, lName, email, password, age, gender, phone } = req.body;

    const emailExist = await dbService.findOne({ model: userModel, filter: { email } });
    if (emailExist) {
        throw new Error("email already exist", { cause: 409 });
    }

    const user = await dbService.create({
        model: userModel,
        data: {
            fName,
            lName,
            email,
            password: await generateHash(password),
            age,
            gender,
            ...(phone && { phone: encrypt(phone) }),
        },
    });

    return successResponse({ res, status: 201, message: "Account created", data: toUserResponse(user) });
};

export const signIn = async (req, res) => {
    const { email, password } = req.body;

    const user = await dbService.findOne({
        model: userModel,
        filter: { email, provider: providerEnum.system },
        select: "+password",
    });

    if (!user || !(await compareHash(password, user.password))) {
        throw new Error("Invalid email or password", { cause: 401 });
    }

    return successResponse({ res, message: "Login success", data: createLoginCredentials(user) });
};

export const refreshToken = async (req, res) => {

    return successResponse({ res, message: "Token refreshed", data: createLoginCredentials(req.user) });
};

export const getProfile = async (req, res) => {
    return successResponse({ res, data: toUserResponse(req.user) });
};

export const shareProfile = async (req, res) => {
    const user = await dbService.findOne({
        model: userModel,
        filter: { _id: req.params.userId },
        select: "fName lName profileImage",
    });
    if (!user) {
        throw new Error("user not found", { cause: 404 });
    }
    return successResponse({ res, data: { _id: user._id, fullName: user.fullName, profileImage: user.profileImage } });
};

export const updateProfile = async (req, res) => {
    const { phone, ...rest } = req.body;
    const user = await dbService.findOneAndUpdate({
        model: userModel,
        filter: { _id: req.user._id },
        update: { ...rest, ...(phone && { phone: encrypt(phone) }) },
    });
    return successResponse({ res, message: "Profile updated", data: toUserResponse(user) });
};

export const updatePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    const user = await dbService.findOne({
        model: userModel,
        filter: { _id: req.user._id },
        select: "+password",
    });
    if (!(await compareHash(oldPassword, user.password))) {
        throw new Error("Invalid old password", { cause: 400 });
    }
    if (await compareHash(newPassword, user.password)) {
        throw new Error("new password must be different from the old one", { cause: 400 });
    }

    user.password = await generateHash(newPassword);
    user.changeCredentialsTime = new Date(); 
    await user.save();

    return successResponse({ res, message: "Password updated, please login again" });
};

export const logoutAll = async (req, res) => {
    await dbService.findOneAndUpdate({
        model: userModel,
        filter: { _id: req.user._id },
        update: { changeCredentialsTime: new Date() },
    });
    return successResponse({ res, message: "Logged out from all devices" });
};

export const deleteProfile = async (req, res) => {
    await dbService.deleteMany({ model: messageModel, filter: { receiverId: req.user._id } });
    await dbService.deleteOne({ model: userModel, filter: { _id: req.user._id } });
    return successResponse({ res, message: "Account deleted" });
};

export const getAllUsers = async (req, res) => {
    const users = await dbService.find({ model: userModel });
    return successResponse({ res, data: users.map(toUserResponse) });
};
