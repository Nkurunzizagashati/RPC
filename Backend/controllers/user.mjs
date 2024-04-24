import User from "../models/user.mjs";
import { validationResult, matchedData } from "express-validator";
import bcrypt from "bcrypt";
import tokenGenerator from "../utils/tokenGenerator.mjs";

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
    console.log(data);
    // HASHING THE PASSWORD
    const unhashedPassword = req.body.password;
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(unhashedPassword, salt);
    data.password = hash;

    // CREATING NEW USER
    const newUser = new User(data);
    await newUser.save();
    req.session.user = newUser.email;
    res.cookie("isAuth", true, { maxAge: 60000 * 60 });
    // CREATING AND SENDING A JWT_TOKEN
    const token = tokenGenerator(newUser);
    return res.status(201).json({ token, createdUser: newUser });
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
      req.session.user = user.email;
      res.cookie("isAuth", true, { maxAge: 60000 * 60 });
      return res.json({ msg: "User Logged in Successfully!" });
    }
    throw new Error("Invalid credentials");
  } catch (error) {
    res.status(401).json({ err: error.message });
  }
};

export { getUsersController, createUserController, loginUserController };
