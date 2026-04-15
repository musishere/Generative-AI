import Groq from "groq-sdk";
import { configDotenv } from "dotenv";
configDotenv();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function main() {
  const completion = await groq.chat.completions.create({
    temperature: 0,
    model: "llama-3.3-70b-versatile",
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: `You are a smart personal assistant who answers the asked questions.
          `,
      },
      {
        role: "user",
        content: `What is weather in lahore today answer in valid JSON`,
        // When was iphone 17 launched. answer should be in valid JSON
      },
    ],
  });

  // Structured output
  console.log(JSON.parse(completion.choices[0].message.content));
}

async function webSearch({ query }) {
  return "Iphone was launched on 20 sep 2024";
}

main();
