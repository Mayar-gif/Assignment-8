import mongoose from "mongoose";
import { env } from "../config/env.service.js";

export default async function connectionDB() {
    try {
        await mongoose.connect(env.dbUri, { serverSelectionTimeoutMS: 5000 });
        console.log("Database connected successfully");
    } catch (error) {
        console.error("Database connection failed:", error.message);
        process.exit(1); 
    }
}
