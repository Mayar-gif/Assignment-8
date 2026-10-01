import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
        trim: true,
        minLength: 1,
        maxLength: 1000,
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
        index: true,
    },
}, {
    timestamps: true,
    strict: true,
    strictQuery: true,
});

const messageModel = mongoose.models.message || mongoose.model("message", messageSchema);
export default messageModel;
