import express from "express";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  console.log(`Hello from the frontend`);
  res.status(200).end("Hello from the server");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
});
