import express from "express";
import dotenv from "dotenv";
import imageRouter from "./routes/image.routes.js";

dotenv.config();

const app = express();

app.use("/api/images", imageRouter);

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Welcome to Image Optimization API");
});

app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});
