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
    const newCourse = new Course(data);
    await newCourse.save();
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

    const courses = await Course.find();
    if (!courses) res.json({ msg: "No course found" });
    res.json({ courses });
  } catch (error) {
    res.json({ err: error.message });
  }
};

const updateCourseController = async (req, res) => {
  try {
    const courseId = req.params.id;
    console.log(courseId);
    if (!courseId)
      return res.status(401).json({
        err: "You have to provide the id of a course you want to update",
      });
    const token = req.cookies.token;
    if (!token) return res.status(403).json({ err: "You need to login first" });

    const loggedInUserId = jwt.decode(token, jwt_secret).id;
    const loggedInUser = await User.findById(loggedInUserId);

    if (!loggedInUser.isAdmin)
      return res
        .status(403)
        .json({ err: "You don't have permission to Update a course" });

    // CHECK FOR VALIDATION RESULT
    const result = validationResult(req);
    if (!result.isEmpty())
      return res.status(401).json({ err: result.errors[0].msg });

    const data = matchedData(req);
    const updatedCourse = Course.findByIdAndUpdate(courseId, data);
  } catch (error) {
    return res.json({ err: error.message });
  }
};

const deleteCourseController = (req, res) => {};

export {
  createCourseController,
  getAllCoursesController,
  updateCourseController,
  deleteCourseController,
};
