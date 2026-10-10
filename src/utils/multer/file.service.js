import fs from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { uploadsRoot } from "./local.multer.js";

const toPublicPath = (absolutePath) =>
    path.relative(path.dirname(uploadsRoot), absolutePath).split(path.sep).join("/");

export const getFilePath = (file) => toPublicPath(file.path);

export const collectFiles = (req) => {
    const files = Array.isArray(req.files) ? req.files : Object.values(req.files ?? {}).flat();
    return [req.file, ...files].filter(Boolean);
};

export const removeFile = async (publicPath) => {
    if (!publicPath) return;
    const absolutePath = path.resolve(path.dirname(uploadsRoot), publicPath);
    if (!absolutePath.startsWith(uploadsRoot + path.sep)) return;
    await fs.promises.unlink(absolutePath).catch(() => {});
};

export const removeFiles = async (publicPaths = []) => {
    await Promise.all(publicPaths.map(removeFile));
};

export const removeUploaded = async (req) => {
    await Promise.all(
        collectFiles(req)
            .filter((file) => file.path)
            .map((file) => fs.promises.unlink(file.path).catch(() => {}))
    );
};

export const saveBuffer = async ({ file, customPath = "general", owner = "public" } = {}) => {
    const folder = path.join(uploadsRoot, customPath, String(owner));
    await fs.promises.mkdir(folder, { recursive: true });
    const absolutePath = path.join(folder, `${randomUUID()}-${path.basename(file.originalname).replace(/[^\w.-]/g, "_")}`);
    await fs.promises.writeFile(absolutePath, file.buffer);
    return toPublicPath(absolutePath);
};
