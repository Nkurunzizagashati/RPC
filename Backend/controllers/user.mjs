import User from "../models/user.mjs";
import { validationResult, matchedData } from "express-validator";
import bcrypt from "bcrypt";
import tokenGenerator from "../utils/tokenGenerator.mjs";
import jwt from "jsonwebtoken";

const getUsersController = async (req, res) => {
  if (!req.cookies.token)
    return res.status(401).json({ err: "You are not loged in" });
  const jwt_secret = process.env.JWT_SECRET;
  const loggedInUserId = jwt.decode(req.cookies.token, jwt_secret).id;
  console.log(loggedInUserId);
  try {
    const users = await User.find({ _id: { $ne: loggedInUserId } }).select(
      "-password"
    );
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
    // CREATING AND SENDING A JWT_TOKEN
    const token = tokenGenerator(newUser);
    res.cookie("token", token, {
      maxAge: 60000 * 60,
      httpOnly: true,
      secure: process.env.NODE_ENVIRONMENT == "production",
    });
    return res.status(201).json({
      createdUser: {
        id: newUser.id,
        firstname: newUser.firstname,
        lastname: newUser.lastname,
        email: newUser.email,
      },
    });
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
    if (user && bcrypt.compare(user.password, data.password)) {
      req.session.user = user.email;
      // CREATING THE TOKEN and SENDING IT IN AN HTTPONLY COOKIE
      const token = tokenGenerator(user);
      res.cookie("token", token, {
        maxAge: 60000 * 60,
        httpOnly: true,
        secure: process.env.NODE_ENVIRONMENT == "production",
      });
      return res.json({ msg: "User Logged in Successfully!" });
    }
    throw new Error("Invalid credentials");
  } catch (error) {
    res.status(401).json({ err: error.message });
  }
};

const deleteUserController = async (req, res) => {
  const result = validationResult(req);
  const jwt_secret = process.env.JWT_SECRET;
  if (!result.isEmpty()) {
    return res.status(401).json({ error: result.errors[0].msg });
  }
  try {
    const data = matchedData(req);
    const id = data.userId;
    console.log(`DELETING USER: ${id}`);

    // Ensure token exists and is valid
    const token = req.cookies.token;
    console.log(token);
    if (!token) {
      return res.status(401).json({ error: "You are not logged in" });
    }

    const decodedToken = jwt.decode(token, jwt_secret);
    console.log(decodedToken);
    if (!decodedToken) {
      return res.status(401).json({ error: "Invalid token" });
    }

    const user = await User.findById(decodedToken.id);
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    const isAdmin = user.isAdmin;
    if (isAdmin || decodedToken.id === id) {
      const deletedUser = await User.findByIdAndDelete(id);
      if (deletedUser) {
        return res.send(`${deletedUser.email} deleted`);
      }
      throw new Error("Can't find this user");
    } else {
      return res
        .status(401)
        .json({ error: "You have no permission to delete this user" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const logoutUserController = (req, res) => {
  try {
    Object.keys(req.cookies).forEach((cookieName) => {
      res.clearCookie(cookieName);
    });
    res.json({ msg: "logged out" });
  } catch (error) {
    res.json({ err: error.message });
  }
};

const updateUserController = async (req, res) => {
  const result = validationResult(req);
  const jwt_secret = process.env.JWT_SECRET;
  if (!result.isEmpty())
    return res.status(401).json({ err: result.errors[0].msg });

  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ err: "You are not logged in" });
    const userId = jwt.decode(token, jwt_secret).id;
    if (!userId) return res.status(401).json({ err: "You are not logged in " });
    const data = matchedData(req);
    const updatedUser = await User.findByIdAndUpdate(userId, data, {
      new: true,
    });
    if (!updatedUser)
      return res.status(500).json({
        err: "Something went wrong, can't update the user, try again please!",
      });
    res.json({ msg: "User Updated successfully!", updatedUser });
  } catch (error) {
    res.json({ err: error.message });
  }
};

export {
  getUsersController,
  createUserController,
  loginUserController,
  deleteUserController,
  logoutUserController,
  updateUserController,
};
