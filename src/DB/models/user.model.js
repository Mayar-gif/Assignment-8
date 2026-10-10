import mongoose from "mongoose";
import { genderEnum, providerEnum, roleEnum } from "../../common/enums.js";

const userSchema = new mongoose.Schema({
    fName: {
        type: String,
        required: true,
        trim: true,
        minLength: 2,
        maxLength: 20,
    },
    lName: {
        type: String,
        required: true,
        trim: true,
        minLength: 2,
        maxLength: 20,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    phone: String, 
    age: {
        type: Number,
        required: true,
        min: 20,
        max: 60,
    },
    gender: {
        type: String,
        enum: Object.values(genderEnum),
        default: genderEnum.male,
    },
    role: {
        type: String,
        enum: Object.values(roleEnum),
        default: roleEnum.user,
    },
    profileImage: String,
    coverImages: [String],
    provider: {
        type: String,
        enum: Object.values(providerEnum),
        default: providerEnum.system,
    },
    isConfirmed: {
        type: Boolean,
        default: false,
    },
    changeCredentialsTime: Date,
}, {
    timestamps: true,
    strict: true,
    strictQuery: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});

userSchema.virtual("fullName").get(function () {
    return `${this.fName} ${this.lName}`;
});

const userModel = mongoose.models.user || mongoose.model("user", userSchema);
export default userModel;
