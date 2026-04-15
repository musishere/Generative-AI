import Groq from "groq-sdk";
import { configDotenv } from "dotenv";
configDotenv();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function main() {
  const completion = await groq.chat.completions.create({
    temperature: 1,
    // stop: "neg", //negative
    // max_completion_tokens: 1000,
    // fr equency_penalty: 2,
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content: `You are Jarvis, a smart review grader. Your task is to analyse given review and return the senitment. Classify the review as positive, neutral or negative. You must return value in valid JSON structure.
          example: {sentiment:"Negative"}.
          `,
      },
      {
        role: "user",
        content: `Review: These headphones arrived quickly and looks great, but the left earcup stopped working after a week.
                sentiment:`,
      },
    ],
  });

  // Structured output
  console.log(JSON.parse(completion.choices[0].message.content));
}

main();
