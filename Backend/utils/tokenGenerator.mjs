import jwt from "jsonwebtoken";

const tokenGenerator = (user) => {
  const jwtSecret = process.env.JWT_SECRET;

  try {
    const token = jwt.sign({ id: user.id }, jwtSecret);
    return token;
  } catch (error) {
    throw new Error(error);
  }
};

export default tokenGenerator;
