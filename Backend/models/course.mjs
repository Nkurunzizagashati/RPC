import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    courseModules: [
      {
        title: {
          type: String,
          required: true,
        },
        introduction: {
          type: String,
          required: true,
        },
        body: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);
