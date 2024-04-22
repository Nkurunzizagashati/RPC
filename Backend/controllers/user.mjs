import User from "../models/user.mjs";
import { validationResult, matchedData } from "express-validator";

const getUsersController = async (req, res) => {
  console.log(req.cookies);
  if (!req.cookies.isAuth)
    return res.status(401).json({ err: "You are not loged in" });
  try {
    const users = await User.find();
    if (users) {
      res.json(users);
      console.log(users);
    } else {
      res.end("no user found");
    }
  } catch (error) {
    res.status(400).json({ err: error.message });
  }
};

const createUserController = async (req, res) => {
  const { body } = req;

  const result = validationResult(req);
  if (!result.isEmpty())
    return res.status(400).json({ err: result.errors[0].msg });
  try {
    const data = matchedData(req);
    const newUser = new User(data);
    await newUser.save();
    res.cookie("isAuth", true, { maxAge: 60000 * 60 });
    return res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ err: error.message });
  }
};

const loginUserController = async (req, res) => {
  const result = validationResult(req);
  if (!result.isEmpty())
    return res.status(401).json({ error: result.errors[0].msg });

  try {
    const data = matchedData(req);
    const user = await User.findOne({ email: data.email });
    if (user && user.password === data.password) {
      res.cookie("isAuth", true, { maxAge: 60000 * 60 });
      return res.json({ msg: "User Logged in Successfully!" });
    }
    throw new Error("Invalid credentials");
  } catch (error) {
    res.status(401).json({ err: error.message });
  }
};

export { getUsersController, createUserController, loginUserController };
