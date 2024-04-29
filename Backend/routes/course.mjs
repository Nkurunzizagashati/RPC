import express from "express";

const router = express.Router();

router.get("/", getAllCoursesController);
router.post("/", createCourseController);
router.patch("/:id", updateCourseController);
router.delete("/:id", deleteCourseController);

export default router;
