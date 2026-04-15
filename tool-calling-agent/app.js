import Groq from "groq-sdk";
import { configDotenv } from "dotenv";
import { tavily } from "@tavily/core";
configDotenv();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const tvily = tavily({ apiKey: process.env.TAVILY_API_KEY });

const tools = [
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
];

function getAssistantText(message) {
  if (typeof message?.content === "string") return message.content;

  if (Array.isArray(message?.content)) {
    return message.content
      .map((part) => {
        if (typeof part === "string") return part;
        if (typeof part?.text === "string") return part.text;
        return "";
      })
      .join("\n")
      .trim();
  }

  return "";
}

async function main() {
  const messages = [
    {
      role: "system",
      content: `You are a smart personal assistant who answers the asked questions.
        You have access to following tools:
        1.searchWeb({query}:{query:string})Search the latest information and realtime data on the internet`,
    },
    {
      role: "user",
      content: `What is iphone 17 launch date?`,
    },
  ];

  while (true) {
    const completion = await groq.chat.completions.create({
      temperature: 0,
      model: "llama-3.3-70b-versatile",
      messages,
      tools,
      tool_choice: "auto",
    });

    const assistantMessage = completion.choices[0].message;
    messages.push(assistantMessage);

    const toolCalls = assistantMessage.tool_calls;
    if (!toolCalls || toolCalls.length === 0) {
      const text = getAssistantText(assistantMessage);
      console.log(`Assistant: ${text || "No textual response returned."}`);
      return;
    }

    for (const tool of toolCalls) {
      const functionName = tool.function.name;
      const functionParams = tool.function.arguments;

      if (functionName === "webSearch") {
        const tool_result = await webSearch(JSON.parse(functionParams));

        messages.push({
          tool_call_id: tool.id,
          role: "tool",
          name: functionName,
          // Groq expects tool content as a string payload.
          content: JSON.stringify(tool_result),
        });
      } else {
        messages.push({
          tool_call_id: tool.id,
          role: "tool",
          name: functionName,
          content: JSON.stringify({ error: `Unknown tool: ${functionName}` }),
        });
      }
    }
  }
}

async function webSearch({ query }) {
  const response = await tvily.search(query);
  const finalResult = response.results.map((result) => result.content);

  // console.log({ FINALRESPONSE: finalResult });

  return finalResult;
}

main();
