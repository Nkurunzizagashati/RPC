import Course from "../models/course.mjs";
import { validationResult, matchedData } from "express-validator";

const createCourseController = async (req, res) => {
  const result = validationResult(req);

  if (!result.isEmpty())
    return res.status(401).json({ err: result.errors[0].msg });

  try {
    const data = matchedData(req);
    const newCourse = await new Course(data);
    if (!newCourse) return res.json({ err: "Something went wrong" });
    res.status(201).json({ msg: "Course created successfully!", newCourse });
  } catch (error) {
    return res.status(401).json({ err: error.message });
  }
};

const getAllCoursesController = (req, res) => {};

const updateCourseController = (req, res) => {};

const deleteCourseController = (req, res) => {};

export {
  createCourseController,
  getAllCoursesController,
  updateCourseController,
  deleteCourseController,
};
