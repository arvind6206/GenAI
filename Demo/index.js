import { PDFExtract } from "pdf.js-extract";
import {RecursiveCharacterTextSplitter} from '@langchain/textsplitters'
import dotenv from 'dotenv'
dotenv.config()
import {GoogleGenerativeAIEmbeddings} from '@langchain/google-genai'
import { Pinecone } from '@pinecone-database/pinecone';
import { PineconeStore } from '@langchain/pinecone';


const pinecone = new Pinecone()
const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX_NAME)


const pdfExtract = new PDFExtract()

const data = await pdfExtract.extract("./dsa.pdf")

// console.log(data)

const fullText = data.pages.map(page => 
    page.content.map(
        item => item.str
    ).join(" ")
).join("\n\n")

// console.log(fullText)

//chunking

const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200
})

// console.log(splitter)

const chunks = await splitter.splitText(fullText)


//embeddings
const embeddings = new GoogleGenerativeAIEmbeddings({
    apiKey: process.env.GEMINI_API_KEY,
    model: "gemini-embedding-001"
})

// Embed chunks one by one with rate limiting and retry logic
const vectors = []
for (let i = 0; i < chunks.length; i++) {
    let retries = 0
    const maxRetries = 5
    
    while (retries < maxRetries) {
        try {
            const fullVector = await embeddings.embedQuery(chunks[i])
            console.log(`Chunk ${i}: Full vector length = ${fullVector.length}`)
            const truncatedVector = fullVector.slice(0, 768)
            console.log(`Chunk ${i}: Truncated vector length = ${truncatedVector.length}`)
            vectors.push(truncatedVector)
            break
        } catch (error) {
            if (error.status === 429 && retries < maxRetries - 1) {
                const retryDelay = Math.pow(2, retries) * 1000 // Exponential backoff
                console.log(`Rate limited. Retrying in ${retryDelay/1000} seconds...`)
                await new Promise(resolve => setTimeout(resolve, retryDelay))
                retries++
            } else {
                throw error
            }
        }
    }
    
    // Add small delay between successful requests
    if (i < chunks.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 500))
    }
}

const records = vectors.map((vector, index) => ({
    id: `dsa-${index}`,
    values: vector,
    metadata: {
        text: chunks[index],
        source: "dsa.pdf"
    }
}))
await pineconeIndex.upsert(records)
console.log(`Successfully stored ${records.length} vectors in Pinecone`)

