import { tokenTypeEnum } from "../common/enums.js";
import { decodeToken } from "../utils/security/token.js";

export const authentication = (tokenType = tokenTypeEnum.access) => {
    return async (req, res, next) => {
        const { user, decoded } = await decodeToken({
            authorization: req.headers.authorization,
            tokenType,
        });
        req.user = user;
        req.decoded = decoded;
        next();
    };
};

export const authorization = (...allowedRoles) => {
    return (req, res, next) => {
        if (!allowedRoles.includes(req.user.role)) {
            throw new Error("Forbidden: you are not allowed to access this resource", { cause: 403 });
        }
        next();
    };
};
