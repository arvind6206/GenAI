import { GoogleGenAI } from "@google/genai";
import dotenv from 'dotenv'
dotenv.config()


const client = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
})

export async function streamResponse(userMessage, res){
    const response = await client.models.generateContentStream({
    model: 'gemini-3.5-flash',
    contents: userMessage
})
 for await (const chunk of response){
    if(chunk.text){
        res.write(`data: ${JSON.stringify({ text: chunk.text})}\n\n`)
    }
 }

 res.write("data: [DONE]\n\n")
 res.end()

}