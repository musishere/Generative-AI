import Groq from "groq-sdk";
import { configDotenv } from "dotenv";
configDotenv();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function main() {
  const completion = await groq.chat.completions.create({
    temperature: 0,
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content: `You are a smart personal assistant who answers the asked questions.
        You have access to following tools:
        1.searchWeb({query}:{query:string})Search the latest information and realtime data on the internet`,
      },
      {
        role: "user",
        content: `What is iphone 17 launch date? `,
      },
    ],
    tools: [
      {
        type: "function",
        function: {
          name: "webSearch",
          description:
            "Search the latest information and realtime data on the internet",
          parameters: {
            // JSON Schema object
            type: "object",
            properties: {
              query: {
                type: "string",
                description: "The search query to perform search on",
              },
            },
          },
        },
        required: ["query"],
      },
    ],
    tool_choice: "auto",
  });

  const toolCalls = completion.choices[0].message.tool_calls;

  if (!toolCalls) {
    console.log(`Assistant: ${completion.choices[0].message.content}`);
  }

  for (const tool of toolCalls) {
    console.log(tool);
    const functionName = tool.function.name;
    const functionParams = tool.function.arguments;

    if (functionName === "webSearch") {
      const tool_result = await webSearch(JSON.parse(functionParams));
    }
  }
}

async function webSearch({ query }) {
  console.log("Calling websearch tool");
  return "Iphone was launched on 20 sep 2024";
}

main();
