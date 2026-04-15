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
                content:'You are Mufi,a smart personal assistant'
            },
            {
                role:'user',
                content:'Who are you?'
            }
        ]
    })

    console.log({"Response":completion.choices[0].message.content})
}

main();