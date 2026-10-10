import multer from "multer";
import fs from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { env } from "../../config/env.service.js";
import { storageEnum, fileMimeEnum } from "../../common/enums.js";

export const uploadsRoot = path.resolve(env.uploadsDir);

const sanitizeName = (name) => path.basename(name).replace(/[^\w.-]/g, "_");

export const localFileUpload = ({
    customPath = "general",
    validation = fileMimeEnum.image,
    storage = storageEnum.disk,
    maxSize = env.maxFileSize,
} = {}) => {
    const diskStorage = multer.diskStorage({
        destination: (req, file, cb) => {
            const owner = String(req.user?._id ?? req.params?.receiverId ?? "public");
            const folder = path.join(uploadsRoot, customPath, owner);
            fs.mkdirSync(folder, { recursive: true });
            cb(null, folder);
        },
        filename: (req, file, cb) => {
            cb(null, `${randomUUID()}-${sanitizeName(file.originalname)}`);
        },
    });

    const fileFilter = (req, file, cb) => {
        if (!validation.includes(file.mimetype)) {
            return cb(new Error(`Invalid file type: ${file.mimetype}`, { cause: 400 }), false);
        }
        cb(null, true);
    };

    return multer({
        storage: storage === storageEnum.memory ? multer.memoryStorage() : diskStorage,
        fileFilter,
        limits: { fileSize: maxSize },
    });
};
