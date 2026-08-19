import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import { streamResponse } from './streamText.js'
dotenv.config()
const app = express()
app.use(cors(
    {
        origin: 'http://localhost:5173',
        withCredentials: true
    }
))
app.use(express.json())


const PORT = process.env.PORT || 3000
app.post('/api/chat', async(req, res) => {
    const {message} = req.body

    res.setHeader("Content-Type", "text/event-stream")
    res.setHeader("Cache-Control", "no-choice")
    res.setHeader("Connection", "keep-alive")

    try {
        await streamResponse(message, res)
    } catch (error) {
        console.error(error)
        res.write(`data: ${JSON.stringify({error: "Something went wrong"})}`)
    }

})
app.listen(PORT,() => {
    console.log(`Server is listening on http://localhost:${PORT}`)
})