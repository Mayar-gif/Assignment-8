import userModel from "../../DB/models/user.model.js";
import messageModel from "../../DB/models/message.model.js";
import * as dbService from "../../DB/db.service.js";
import { successResponse } from "../../common/response.js";
import { getFilePath, removeFiles, removeUploaded } from "../../utils/multer/file.service.js";

export const sendMessage = async (req, res) => {
    const receiver = await dbService.findOne({
        model: userModel,
        filter: { _id: req.params.receiverId },
        select: "_id",
    });
    if (!receiver) {
        await removeUploaded(req);
        throw new Error("receiver not found", { cause: 404 });
    }
    await dbService.create({
        model: messageModel,
        data: {
            content: req.body.content,
            receiverId: receiver._id,
            attachments: (req.files ?? []).map(getFilePath),
        },
    });
    return successResponse({ res, status: 201, message: "Message sent" });
};

export const getMyMessages = async (req, res) => {
    const messages = await dbService.find({
        model: messageModel,
        filter: { receiverId: req.user._id },
        select: "content attachments createdAt",
        options: { sort: { createdAt: -1 } },
    });
    return successResponse({ res, data: messages });
};

export const getMessage = async (req, res) => {
    const message = await dbService.findOne({
        model: messageModel,
        filter: { _id: req.params.messageId, receiverId: req.user._id },
        select: "content attachments createdAt",
    });
    if (!message) {
        throw new Error("message not found", { cause: 404 });
    }
    return successResponse({ res, data: message });
};

export const deleteMessage = async (req, res) => {
    const message = await dbService.findOne({
        model: messageModel,
        filter: { _id: req.params.messageId, receiverId: req.user._id },
        select: "attachments",
    });
    if (!message) {
        throw new Error("message not found", { cause: 404 });
    }
    await dbService.deleteOne({ model: messageModel, filter: { _id: message._id } });
    await removeFiles(message.attachments);
    return successResponse({ res, message: "Message deleted" });
};
