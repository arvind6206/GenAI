//pdf load

import * as dotenv from "dotenv";
dotenv.config();
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { Pinecone } from "@pinecone-database/pinecone";
import { PineconeStore } from "@langchain/pinecone";
import { GoogleGenAI } from "@google/genai";


async function indexDocument() {
  const PDF_PATH = "./dsa.pdf";
  const pdfLoader = new PDFLoader(PDF_PATH);
  const rawDocs = await pdfLoader.load();

  //chunking
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });

  const chunkedDocs = await textSplitter.splitDocuments(rawDocs);

  //vector embedding model

  const embeddings = new GoogleGenerativeAIEmbeddings({
    apiKey: process.env.GEMINI_API_KEY,
    model: "gemini-embedding-2",
    outputDimensionality: 768,
  });


const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const result = await ai.models.embedContent({
  model: "gemini-embedding-2",
  contents: "Hello world",
  config: {
    outputDimensionality: 768,
  },
});

console.log(result.embeddings[0].values.length);


  const testVector = await embeddings.embedQuery("Hello world");

  console.log("dimensions:", testVector.length);



  //Database configuration

  const pinecone = new Pinecone();
  const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX_NAME);

  //langchain (chunking, embedding, database)
//   await PineconeStore.fromDocuments(chunkedDocs, embeddings, {
//     pineconeIndex,
//     maxConcurrency: 5,
//   });
}

indexDocument();
