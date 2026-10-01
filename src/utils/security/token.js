import jwt from "jsonwebtoken";
import { env } from "../../config/env.service.js";
import * as dbService from "../../DB/db.service.js";
import userModel from "../../DB/models/user.model.js";
import { roleEnum, tokenTypeEnum } from "../../common/enums.js";

export const prefixToRole = {
    Bearer: roleEnum.user,
    System: roleEnum.admin,
};
const roleToPrefix = { [roleEnum.user]: "Bearer", [roleEnum.admin]: "System" };

const secrets = {
    [roleEnum.user]: {
        [tokenTypeEnum.access]: env.userAccessSecret,
        [tokenTypeEnum.refresh]: env.userRefreshSecret,
    },
    [roleEnum.admin]: {
        [tokenTypeEnum.access]: env.adminAccessSecret,
        [tokenTypeEnum.refresh]: env.adminRefreshSecret,
    },
};

export const createLoginCredentials = (user) => {
    const payload = { sub: user._id.toString(), role: user.role };
    const roleSecrets = secrets[user.role];
    return {
        tokenPrefix: roleToPrefix[user.role],
        accessToken: jwt.sign(payload, roleSecrets[tokenTypeEnum.access], {
            expiresIn: env.accessExpiresIn,
        }),
        refreshToken: jwt.sign(payload, roleSecrets[tokenTypeEnum.refresh], {
            expiresIn: env.refreshExpiresIn,
        }),
    };
};

export const decodeToken = async ({ authorization, tokenType = tokenTypeEnum.access } = {}) => {
    if (!authorization) {
        throw new Error("Missing Authorization header", { cause: 401 });
    }

    const parts = authorization.trim().split(/\s+/);
    const [prefix, token] = parts;
    if (parts.length !== 2 || !Object.hasOwn(prefixToRole, prefix)) {
        throw new Error("Invalid Authorization format. Use: Bearer <token>", { cause: 401 });
    }

    const role = prefixToRole[prefix];
    let decoded;
    try {
        decoded = jwt.verify(token, secrets[role][tokenType]);
    } catch (error) {
        const message = error.name === "TokenExpiredError" ? "Token expired" : "Invalid token";
        throw new Error(message, { cause: 401 });
    }

    const user = await dbService.findOne({ model: userModel, filter: { _id: decoded.sub } });
    if (!user || user.role !== role) {
        throw new Error("User not found", { cause: 401 });
    }

    if (user.changeCredentialsTime && decoded.iat < Math.floor(user.changeCredentialsTime.getTime() / 1000)) {
        throw new Error("Token revoked, please login again", { cause: 401 });
    }

    return { user, decoded };
};
