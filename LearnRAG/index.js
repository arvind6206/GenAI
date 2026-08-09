import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { GoogleGenAI } from "@google/genai";
import { Pinecone } from "@pinecone-database/pinecone";
import dotenv from "dotenv";

dotenv.config();

// ==============================
// Environment Variables
// ==============================

const {
  GEMINI_API_KEY,
  PINECONE_API_KEY,
  PINECONE_INDEX_NAME,
} = process.env;

if (!GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is missing");
}

if (!PINECONE_API_KEY) {
  throw new Error("PINECONE_API_KEY is missing");
}

if (!PINECONE_INDEX_NAME) {
  throw new Error("PINECONE_INDEX_NAME is missing");
}



const PDF_PATH = "./dsa.pdf";

const CHUNK_SIZE = 1000;
const CHUNK_OVERLAP = 200;

const EMBEDDING_MODEL = "gemini-embedding-001";

const EMBEDDING_DIMENSION = 768;

const NAMESPACE = "dsa-documents";




const ai = new GoogleGenAI({
  apiKey: GEMINI_API_KEY,
});




const pinecone = new Pinecone({
  apiKey: PINECONE_API_KEY,
});

const index = pinecone.Index(PINECONE_INDEX_NAME);


async function loadPDF() {
  console.log("Loading PDF...");

  const loader = new PDFLoader(PDF_PATH);

  const documents = await loader.load();

  console.log(`Loaded ${documents.length} pages`);

  return documents;
}



async function createChunks(documents) {
  console.log("Splitting documents...");

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: CHUNK_SIZE,
    chunkOverlap: CHUNK_OVERLAP,
  });

  const chunks = await splitter.splitDocuments(documents);

  console.log(`Created ${chunks.length} chunks`);

  return chunks;
}


// ==============================
// Generate Embedding
// ==============================

async function generateEmbedding(text) {
  const result = await ai.models.embedContent({
    model: EMBEDDING_MODEL,

    contents: text,

    config: {
      taskType: "RETRIEVAL_DOCUMENT",
      outputDimensionality: EMBEDDING_DIMENSION,
    },
  });

  const vector = result.embeddings?.[0]?.values;

  if (!vector) {
    throw new Error("Failed to generate embedding");
  }

  return vector;
}


async function createVectors(chunks) {
  const vectors = [];

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];

    console.log(
      `Processing chunk ${i + 1}/${chunks.length}`
    );

    const embedding = await generateEmbedding(
      chunk.pageContent
    );

    vectors.push({
      id: `dsa-${i}`,

      values: embedding,

      metadata: {
        text: chunk.pageContent,

        source:
          chunk.metadata?.source || PDF_PATH,

        page:
          chunk.metadata?.loc?.pageNumber || 0,

        chunkIndex: i,
      },
    });
  }

  return vectors;
}


// ==============================
// Upload to Pinecone
// ==============================

async function uploadToPinecone(vectors) {
  console.log("Uploading vectors to Pinecone...");

  await index
    .namespace(NAMESPACE)
    .upsert(vectors);

  console.log(
    `Successfully uploaded ${vectors.length} vectors`
  );
}


// ==============================
// Main Function
// ==============================

async function indexDocument() {
  try {
    console.log("Starting document indexing...\n");

    // 1. Load PDF
    const documents = await loadPDF();

    // 2. Split into chunks
    const chunks = await createChunks(documents);

    // 3. Generate embeddings
    const vectors = await createVectors(chunks);

    // 4. Upload to Pinecone
    await uploadToPinecone(vectors);

    console.log(
      "\nDocument indexed successfully!"
    );

  } catch (error) {
    console.error(
      "\nError while indexing document:"
    );

    console.error(error);

    process.exit(1);
  }
}


indexDocument();