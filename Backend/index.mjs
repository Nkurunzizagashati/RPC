import express from "express";
import userRouter from "./routes/user.mjs";
import createDbConnection from "./db.mjs";
import cookieParser from "cookie-parser";
import session from "express-session";

// CONNECT TO THE DATABASE
createDbConnection();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    secret: "Session secret sentence",
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 60000 * 60,
      httpOnly: true,
    },
  })
);

// ROUTES REGISTRATION
app.use("/users", userRouter);

app.get("/", (req, res) => {
  res.status(200).end("Hello from the server");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
});
