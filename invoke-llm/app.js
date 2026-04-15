import Groq from "groq-sdk";
import { configDotenv } from "dotenv";
configDotenv()

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function main(){
    const completion = await groq.chat.completions.create({
        model:"llama-3.3-70b-versatile",
        messages:[
            {
                role:'user',
                content:'Hi'
            }
        ]
    })

    console.log({"Response from api":completion})
}

main()