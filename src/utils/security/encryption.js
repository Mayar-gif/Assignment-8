import crypto from "node:crypto";
import { env } from "../../config/env.service.js";

const key = crypto.createHash("sha256").update(env.encryptionKey).digest(); 

export const encrypt = (plaintext) => {
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
    const data = Buffer.concat([cipher.update(String(plaintext), "utf8"), cipher.final()]);
    const tag = cipher.getAuthTag();
    return [iv, tag, data].map((b) => b.toString("hex")).join(":");
};

export const decrypt = (payload) => {
    const [iv, tag, data] = payload.split(":").map((h) => Buffer.from(h, "hex"));
    const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
    decipher.setAuthTag(tag);
    return Buffer.concat([decipher.update(data), decipher.final()]).toString("utf8");
};
