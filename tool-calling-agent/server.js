import express from "express";
import { configDotenv } from "dotenv";
import cors from "cors";
import { generateOutput } from "./chatbot.js";
configDotenv();

const port = process.env.PORT || 5000;
const app = express();
app.use(express.json());

app.use(cors());

app.get("/", (req, res) => {
  res.json("HELLO");
});

app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || typeof message !== "string" || !message.trim()) {
      return res
        .status(400)
        .json({ success: false, error: "message is required" });
    }

    const result = await generateOutput(message);
    return res.status(200).json({ success: true, result });
  } catch (error) {
    console.error("/chat error:", error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
});

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
