import mongoose from "mongoose";

const driveSchema = new mongoose.Schema(
  {
    vechicleNumber: {
      type: String,
      required: true,
    },
    defaultAddress: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    phoneNumber1: {
      type: Number,
      required: true,
    },
    phoneNumber2: {
      type: Number,
      required: true,
    },
    licenseNo: {
      type: String,
      required: true,
      unique: true,
    },
    company: {
      type: String,
      required: true,
    },
    licenseUrls: {
      type: Array,
      required: true,
    },
    documentUrls: {
      type: Array,
      required: true,
    },
    userRef: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    userMail: {
      type: String,
      required: true,
    },
    userImage: {
      type: String,
      required: true,
    },
    approved: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
const Drive = mongoose.model("Drive", driveSchema);

export default Drive;
 