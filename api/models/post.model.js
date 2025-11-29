import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    departmentName: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
    latitude: {
      type: Number,
      required: true,
    },
    website: {
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
    registrationNo: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    documentUrls: {
      type: Array,
      required: true,
    },
    imageUrls: {
      type: Array,
      required: true,
    },
    userRef: {
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
const Post = mongoose.model("Post", postSchema);

export default Post;
 