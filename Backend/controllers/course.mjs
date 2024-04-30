import Course from "../models/course.mjs";
import jwt from "jsonwebtoken";
import { validationResult, matchedData } from "express-validator";
import User from "../models/user.mjs";

const jwt_secret = process.env.JWT_SECRET;

const createCourseController = async (req, res) => {
  try {
    const result = validationResult(req);

    const token = req.cookies.token;
    if (!token) return res.status(403).json({ err: "You need to login first" });

    const loggedInUserId = jwt.decode(token, jwt_secret).id;
    const loggedInUser = await User.findById(loggedInUserId);

    if (!loggedInUser.isAdmin)
      return res
        .status(403)
        .json({ err: "You don't have permission to create a course" });

    if (!result.isEmpty())
      return res.status(401).json({ err: result.errors[0].msg });

    const data = matchedData(req);
    const newCourse = await new Course(data);
    if (!newCourse) return res.json({ err: "Something went wrong" });
    res.status(201).json({ msg: "Course created successfully!", newCourse });
  } catch (error) {
    return res.status(401).json({ err: error.message });
  }
};

const getAllCoursesController = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token)
      return res.status(403).json({ err: "You need to loggin first" });
    const loggedInUserId = jwt.decode(token, jwt_secret).id;
    const loggedInUser = await User.findById(loggedInUserId);
    if (!loggedInUser)
      return res.status(403).json({
        err: "User not recognized, you need to loggin or register to access the courses",
      });
  } catch (error) {
    res.json({ err: error.message });
  }
};

const updateCourseController = (req, res) => {};

const deleteCourseController = (req, res) => {};

export {
  createCourseController,
  getAllCoursesController,
  updateCourseController,
  deleteCourseController,
};
