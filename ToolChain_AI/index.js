import {GoogleGenAI} from '@google/genai'
import dotenv from 'dotenv'
dotenv.config()

const client = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
})

const response = await client.interactions.create({
    model: 'gemini-3.5-flash',
    input: 'what is 25 multiplied by 40?',

    tools: [
        {
            type: "function",
            name: "calculator",
            description: "Perform basic mathematical calculations",
            parameters: {
                type: "object",
                properties: {
                    a: {
                        type: "number"
                    },
                    b: {
                        type: "number"
                    },
                    operation: {
                        type: "string",
                        enum: ["add", "subtract", "multiply", "divide"]
                    }
                },
                required: ["a", "b", "operation"]
            }
            
        }
    ]

})


const toolCall = response.steps.find(
    step => step.type === "function_call"
)

if(toolCall){
    console.log("Tool called:", toolCall.name)
    console.log("Arguments:", toolCall.arguments)

    const args = toolCall.arguments;

    const result = calculator(
        args.a,
        args.b,
        args.operation
    )

    console.log(result)
}

function calculator(a, b, operation){
    switch(operation){
        case "add":
            return a + b
        case "subtract":
            return a - b
        case "multiply":
            return a * b

        case "divide":
            if(b == 0){
                throw new Error("can not divide by zero")
            }
            return a / b
        default:
            throw new Error("Invalid operation")
        
    }
}