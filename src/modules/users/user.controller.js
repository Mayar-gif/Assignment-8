import { Router } from "express";
import * as US from "./user.service.js";
import * as UV from "./user.validation.js";
import { validation } from "../../middleware/validation.middleware.js";
import { authentication, authorization } from "../../middleware/auth.middleware.js";
import { roleEnum, tokenTypeEnum, storageEnum, fileMimeEnum } from "../../common/enums.js";
import { localFileUpload } from "../../utils/multer/local.multer.js";

const userRouter = Router();

userRouter.post("/signUp", validation(UV.signUp), US.signUp);
userRouter.post("/signIn", validation(UV.signIn), US.signIn);
userRouter.post("/refresh-token", authentication(tokenTypeEnum.refresh), US.refreshToken);

userRouter.get("/profile", authentication(), US.getProfile);
userRouter.patch("/profile", authentication(), validation(UV.updateProfile), US.updateProfile);
userRouter.patch("/profile/password", authentication(), validation(UV.updatePassword), US.updatePassword);
userRouter.patch(
    "/profile/image",
    authentication(),
    localFileUpload({ customPath: "profile", validation: fileMimeEnum.image }).single("image"),
    validation(UV.profileImage),
    US.uploadProfileImage
);
userRouter.patch(
    "/profile/image/memory",
    authentication(),
    localFileUpload({ validation: fileMimeEnum.image, storage: storageEnum.memory }).single("image"),
    validation(UV.profileImage),
    US.uploadProfileImageMemory
);
userRouter.patch(
    "/profile/cover-images",
    authentication(),
    localFileUpload({ customPath: "cover", validation: fileMimeEnum.image }).array("images", 5),
    validation(UV.coverImages),
    US.uploadCoverImages
);
userRouter.patch(
    "/profile/files",
    authentication(),
    localFileUpload({ customPath: "profile", validation: fileMimeEnum.image }).fields([
        { name: "profileImage", maxCount: 1 },
        { name: "coverImages", maxCount: 5 },
    ]),
    validation(UV.profileFiles),
    US.uploadProfileFiles
);
userRouter.delete("/profile", authentication(), US.deleteProfile);
userRouter.post("/logout-all", authentication(), US.logoutAll);

userRouter.get("/share/:userId", validation(UV.shareProfile), US.shareProfile);

userRouter.get("/", authentication(), authorization(roleEnum.admin), US.getAllUsers);

export default userRouter;
