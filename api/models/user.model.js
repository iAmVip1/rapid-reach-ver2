import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    profilePicture: {
        type: String,
        // Local default avatar served from /uploads (place default-avatar.jpg there)
        default: "/uploads/default-avatar.jpg",
        required: true,
    },
    isHospital: {
        type: Boolean,
        default: false,
    },
    isFireDep: {
        type: Boolean,
        default: false,
    },
    isPoliceDep: {
        type: Boolean,
        default: false,
    },
    isPoliceVAn: {
        type: Boolean,
        default: false,
    },
    isAmbulance: {
        type: Boolean,
        default: false,
    },
    isBlood: {
        type: Boolean,
        default: false,
    },
    isFireTruck: {
        type: Boolean,
        default: false,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
}, 
{timestamps:true}
);

const User = mongoose.model('User', userSchema);

export default User;