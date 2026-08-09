import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import resRouter from './routes/resRoute.js'

dotenv.config()
const app = express()
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))
app.use(express.json())
const PORT = process.env.PORT

app.use('/api', resRouter)

async function main(){
    app.listen(PORT, () => {
        console.log(`Server is listening on http://localhost:${PORT}`)
    })
}
main()