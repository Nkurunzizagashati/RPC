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
        contentType: {
          type: String,
          enum: ["turtorial", "video", "course", "article"],
          required: true,
        },
        additionContentLink: {
          type: String,
          required: function () {
            return this.contentType != "course";
          },
        },
        completed: {
          type: Boolean,
          required: true,
          default: false,
        },
      },
    ],
  },
  { timestamps: true }
);
