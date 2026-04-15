import Groq from "groq-sdk";
import { configDotenv } from "dotenv";
configDotenv()

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function main(){
    const completion = await groq.chat.completions.create({
        model:"llama-3.3-70b-versatile",
        messages:[
            {
                role:'system',
                content:'You are Jarvis, a smart review grader. Your task is to analyse given review and return the senitment. Classify the review as positive, neutral or negative. Output must be in single word'
            },
            {
                role:'user',
                content:`Review: These headphones arrived quickly and looks great, but the left earcup stopped working after a week.
                sentiment:`

            }
        ]
    })

    console.log({"Response":completion.choices[0].message.content})
}

main();