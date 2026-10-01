import { Router } from "express";
import * as US from "./user.service.js";
import * as UV from "./user.validation.js";
import { validation } from "../../middleware/validation.middleware.js";
import { authentication, authorization } from "../../middleware/auth.middleware.js";
import { roleEnum, tokenTypeEnum } from "../../common/enums.js";

const userRouter = Router();

userRouter.post("/signUp", validation(UV.signUp), US.signUp);
userRouter.post("/signIn", validation(UV.signIn), US.signIn);
userRouter.post("/refresh-token", authentication(tokenTypeEnum.refresh), US.refreshToken);

userRouter.get("/profile", authentication(), US.getProfile);
userRouter.patch("/profile", authentication(), validation(UV.updateProfile), US.updateProfile);
userRouter.patch("/profile/password", authentication(), validation(UV.updatePassword), US.updatePassword);
userRouter.delete("/profile", authentication(), US.deleteProfile);
userRouter.post("/logout-all", authentication(), US.logoutAll);

userRouter.get("/share/:userId", validation(UV.shareProfile), US.shareProfile);

userRouter.get("/", authentication(), authorization(roleEnum.admin), US.getAllUsers);

export default userRouter;
