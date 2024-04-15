import express from "express";
import userRouter from "./routes/user.mjs";
import createDbConnection from "./db.mjs";

// CONNECT TO THE DATABASE
createDbConnection();

const app = express();
app.use(express.json());
app.use("/users", userRouter);

app.get("/", (req, res) => {
  console.log(`Hello from the frontend`);
  res.status(200).end("Hello from the server");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
});
