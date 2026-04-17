import express from "express";
import { configDotenv } from "dotenv";
import { generateOutput } from "./chatbot.js";
configDotenv();

const port = process.env.PORT || 5000;
const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.json("HELLO");
});

app.post("/chat", async (req, res) => {
  const { message } = req.body;

  const result = await generateOutput(message);
  return res.status(200).json({ success: true, result });
});

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
