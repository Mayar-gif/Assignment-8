import express from "express";
import { env } from "./config/env.service.js";
import connectionDB from "./DB/connectionDB.js";
import userRouter from "./modules/users/user.controller.js";
import messageRouter from "./modules/messages/message.controller.js";
import { notFoundHandler, globalErrorHandler } from "./middleware/error.middleware.js";

const bootstrap = async () => {
    const app = express();
    app.use(express.json());

    await connectionDB();

    app.get("/", (req, res) => {
        res.status(200).json({ message: "Welcome on sara7a app" });
    });

    app.use("/users", userRouter);
    app.use("/messages", messageRouter);
    app.use(notFoundHandler);
    app.use(globalErrorHandler);

    app.listen(env.port, () => {
        console.log(`Server is running on http://localhost:${env.port}`);
    });
};

export default bootstrap;
