import express from "express";
import {
  createUserController,
  getUsersController,
  loginUserController,
  deleteUserController,
} from "../controllers/user.mjs";

import { body, validationResult, check, checkSchema } from "express-validator";
import {
  createUserValidator,
  deleteUserValidator,
  loginUserValidator,
} from "../middlewares/validationSchemas.mjs";

const router = express.Router();

router.get("/", getUsersController);

router.post("/", checkSchema(createUserValidator), createUserController);
router.post("/login", checkSchema(loginUserValidator), loginUserController);
router.delete(
  "/:userId",
  checkSchema(deleteUserValidator),
  deleteUserController
);

export default router;
