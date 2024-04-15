import User from "../models/user.mjs";

const getUsersController = async (req, res) => {
  try {
    const users = await User.find();
    if (users) {
      res.json(users);
      console.log(users);
    } else {
      res.end("no user found");
    }
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const createUserController = async (req, res) => {
  const { body } = req;
  try {
    if (!body.firstname || !body.lastname || !body.email || !body.password)
      throw new Error("all fields are required");
    const newUser = new User(body);
    await newUser.save();
    return res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export { getUsersController, createUserController };
