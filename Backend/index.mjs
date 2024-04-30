import express from "express";
import userRouter from "./routes/user.mjs";
import createDbConnection from "./db.mjs";
import cookieParser from "cookie-parser";
import session from "express-session";
import MongoDBStoreFactory from "connect-mongodb-session";
import courseRouter from "./routes/course.mjs";

import dotenv from "dotenv";

dotenv.config();

// CONNECT TO THE DATABASE
createDbConnection();

const MongoDBStore = MongoDBStoreFactory(session);
const store = new MongoDBStore({
  uri: process.env.MONGODB_URI,
  collection: "rpc-sessions",
});

store.on("error", (err) => {
  console.log("Can't connect to MongoDBStore");
});

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    secret: "Session secret key",
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 60000 * 60,
      httpOnly: true,
    },
    store: store,
  })
);

// ROUTES REGISTRATION
app.use("/users", userRouter);
app.use("/courses", courseRouter);
app.use("*", (req, res) => {
  return res.status(400).json({ err: `${req.url} not found` });
});

app.get("/", (req, res) => {
  res.status(200).end("Hello from the server");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
});
