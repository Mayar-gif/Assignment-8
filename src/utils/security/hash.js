import bcrypt from "bcryptjs";
import { env } from "../../config/env.service.js";

export const generateHash = async (plaintext) => bcrypt.hash(plaintext, env.saltRounds);

export const compareHash = async (plaintext, hashValue) => bcrypt.compare(plaintext, hashValue);
