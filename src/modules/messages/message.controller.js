import { Router } from "express";
import * as MS from "./message.service.js";
import * as MV from "./message.validation.js";
import { validation } from "../../middleware/validation.middleware.js";
import { authentication } from "../../middleware/auth.middleware.js";
import { localFileUpload } from "../../utils/multer/local.multer.js";
import { fileMimeEnum } from "../../common/enums.js";

const messageRouter = Router();

messageRouter.get("/", authentication(), MS.getMyMessages);
messageRouter.get("/:messageId", authentication(), validation(MV.messageId), MS.getMessage);
messageRouter.delete("/:messageId", authentication(), validation(MV.messageId), MS.deleteMessage);
messageRouter.post(
    "/:receiverId",
    localFileUpload({ customPath: "messages", validation: fileMimeEnum.image }).array("attachments", 2),
    validation(MV.sendMessage),
    MS.sendMessage
);

export default messageRouter;
