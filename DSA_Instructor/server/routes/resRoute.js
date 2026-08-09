import { GoogleGenAI } from '@google/genai'
import {Router} from 'express'
const resRouter = Router()
import dotenv from 'dotenv'
dotenv.config()

const ai = new GoogleGenAI({
    apikey: process.env.GEMINI_API_KEY
})

resRouter.post('/instructor', async(req, res) => {
    try {
        const {question} = req.body
        if(!question){
            return res.status(400).json({
                msg: "Question is required"
            })
        }
        
        const response = await ai.interactions.create({
            model: "gemini-3.6-flash",
            input: question,

            system_instruction: `
                You are a DSA(Data Structure and Algorithms) instructor.

                Your job is to answer questions related to:
                - Data Structures
                - Algorithms
                - Time and Space Complexity
                - Competitive Programming
                - Coding interview problems

                Explain concepts clearly and provide examples when necessary.

                If the user asks something unrelated to DSA,
                tell them that you only answer DSA-related questions.

            `,
        })
        return res.status(200).json({
            success: true,
            answer: response.output_text
        })
    } catch (error) {
        console.error("Instruction Error: ", error)
        return res.status(500).json({
            success: false,
            message: "Failed to generate response"
        })
    }
})

export default resRouter;