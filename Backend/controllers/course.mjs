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
    const updatedCourse = await Course.findByIdAndUpdate(courseId, data, {
      new: true,
    }).select("-courseModules");
    if (!updatedCourse) {
      return res.status(500).json({
        err: "Something went wrong, can't update the course, try again please!",
      });
    }
    return res.json({ msg: "Course Updated successfully!", updatedCourse });
  } catch (error) {
    return res.json({ err: error.message });
  }
};

const deleteCourseController = async (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(403).json({ err: "You need to login" });
  const loggedInUserId = jwt.decode(token, jwt_secret).id;
  if (!loggedInUserId)
    return res.status(403).json({ err: "You need to login" });

  const loggedInUser = await User.findById(loggedInUserId);
  if (!loggedInUser) return res.status(403).json({ err: "You need to login" });
  if (!loggedInUser.isAdmin)
    return res
      .status(403)
      .json({ err: "You don't have permission to delete a course" });
};

const updateCourseModuleController = async (req, res) => {
  const courseId = req.params.courseId;
  const moduleId = req.params.moduleId;

  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ err: "You are not logged in" });
    const loggedInUserId = jwt.decode(token, jwt_secret).id;
    const loggedInUser = await User.findById(loggedInUserId);
    if (!loggedInUser)
      return res.status(401).json({ err: "You are not logged in" });
    if (!loggedInUser.isAdmin)
      return res.status(403).json({ err: "Only Admin can update the course" });

    // CHECK VALIDATION RESULT AND RETRIVE DATA FROM THE VALIDATOR
    const result = validationResult(req);
    if (!result.isEmpty())
      return res.status(401).json({ err: result.errors[0].msg });
    const data = matchedData(req);

    const course = await Course.findById(courseId);
    if (!course)
      return res
        .status(404)
        .json({ err: "The Course You want to update Can not be Found" });

    const moduleIndex = course.courseModules.findIndex(
      (module) => module._id.toString() === moduleId
    );

    if (moduleIndex == -1)
      return res
        .status(404)
        .json({ err: "The module you want to update can not be found" });
    const fieldsToUpdateArray = data.keys;
    fieldsToUpdateArray.length > 0 &&
      fieldsToUpdateArray.forEach((field) => {
        course.courseModules[moduleIndex][field] = data[field];
      });

    const savedCourse = await course.save();

    if (!savedCourse)
      return res
        .status(500)
        .json({ err: "Something went wrong, please try again" });

    res.json({
      msg: "Module updated Successfully",
      updatedModule: savedCourse.courseModules[moduleIndex],
    });
  } catch (error) {
    res.json({ err: error.message });
  }
};

export {
  createCourseController,
  getAllCoursesController,
  updateCourseController,
  deleteCourseController,
  updateCourseModuleController,
};
