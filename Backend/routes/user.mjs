import express from "express";
import {
  createUserController,
  getUsersController,
} from "../controllers/user.mjs";

import { body, validationResult, check, checkSchema } from "express-validator";
import { createUserValidator } from "../middlewares/validationSchemas.mjs";

const router = express.Router();

router.get("/", body("username"), getUsersController);

router.post("/", checkSchema(createUserValidator), createUserController);

export default router;
