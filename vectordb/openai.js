import OpenAI from 'openai'
let openai;

export const configOpenAi = () => {
     openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
    })
}

export const getOpenAiClient = () => {
    if(!openai){
        throw new Error(
            "OpenAI client not configured. Please call configureOpenAi() first."
        )
    }
    return openai
}