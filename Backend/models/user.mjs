import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userShema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: [true, "This email is already in use"],
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userShema);

userShema.pre("save", async function (next) {
  console.log("Hashing password");
  try {
    const salt = await bcrypt.genSalt();
    console.log(salt);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error); // Pass any errors to the next middleware
  }
});

export default User;
