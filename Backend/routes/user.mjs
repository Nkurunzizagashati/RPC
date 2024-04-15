import express from "express";

const router = express.Router();

const users = [
  {
    name: "Person1",
    age: 23,
  },
  {
    name: "Person2",
    age: 20,
  },
  {
    name: "Person3",
    age: 25,
  },
];

router.get("/", (req, res) => {
  res.json(users);
});

router.post("/", (req, res) => {
  const { body } = req;
  console.log(body);
  res.end("User created");
});

export default router;
