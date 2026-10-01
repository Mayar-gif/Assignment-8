import { env } from "../config/env.service.js";

export const notFoundHandler = (req, res) => {
    throw new Error(`url:${req.originalUrl} with method:${req.method} not found`, { cause: 404 });
};

export const globalErrorHandler = (err, req, res, next) => {
    let status = typeof err.cause === "number" ? err.cause : err.status || 500;
    let message = err.message;

    if (err.name === "ValidationError") status = 400;               
    if (err.name === "CastError") { status = 400; message = "Invalid id"; }
    if (err.code === 11000) {                                      
        status = 409;
        message = `${Object.keys(err.keyValue || {}).join(", ") || "value"} already exist`;
    }
    if (err.type === "entity.parse.failed") message = "Invalid JSON body";

    const isProd = env.nodeEnv === "production";
    if (status === 500 && isProd) message = "Internal server error";

    res.status(status).json({
        message,
        ...(err.details && { errors: err.details }),
        ...(!isProd && status === 500 && { stack: err.stack }),
    });
};
