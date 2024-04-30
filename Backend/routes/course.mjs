import express from "express";
import { checkSchema } from "express-validator";
import { createCourseValidator } from "../middlewares/coursesValidationSchemas.mjs";
import { createCourseController } from "../controllers/course.mjs";

const router = express.Router();

// router.get("/", getAllCoursesController);
router.post("/", checkSchema(createCourseValidator), createCourseController);
// router.patch("/:id", updateCourseController);
// router.delete("/:id", deleteCourseController);

export default router;
