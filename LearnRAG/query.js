import dotenv from "dotenv";
dotenv.config();

import readlineSync from "readline-sync";
import { GoogleGenAI } from "@google/genai";
import { Pinecone } from "@pinecone-database/pinecone";


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




const EMBEDDING_MODEL = "gemini-embedding-001";

const EMBEDDING_DIMENSION = 768;

const NAMESPACE = "dsa-documents";



const ai = new GoogleGenAI({
  apiKey: GEMINI_API_KEY,
});




const pinecone = new Pinecone({
  apiKey: PINECONE_API_KEY,
});

const index = pinecone.Index(
  PINECONE_INDEX_NAME
);



const History = [];


async function chatting(question) {

  try {


    const result = await ai.models.embedContent({

      model: EMBEDDING_MODEL,

      contents: question,

      config: {
        taskType: "RETRIEVAL_QUERY",

        outputDimensionality: EMBEDDING_DIMENSION,
      },
    });


    const queryVector =
      result.embeddings?.[0]?.values;


    if (!queryVector) {
      throw new Error(
        "Failed to generate query embedding"
      );
    }


    console.log(
      "Query vector dimension:",
      queryVector.length
    );


    const searchResults = await index
      .namespace(NAMESPACE)
      .query({

        topK: 10,

        vector: queryVector,

        includeMetadata: true,
      });


    console.log(
      "Retrieved chunks:",
      searchResults.matches.length
    );

    const context = searchResults.matches
      .map(
        (match) =>
          match.metadata?.text
      )
      .filter(Boolean)
      .join("\n\n---\n\n");


    History.push({

      role: "user",

      parts: [
        {
          text: question,
        },
      ],
    });


    const response =
      await ai.models.generateContent({

        model: "gemini-3-flash-preview",

        contents: History,

        config: {

          systemInstruction: `
You have to behave like a Data Structure and Algorithm Expert.

You will be given a context of relevant information
and a user question.

Your task is to answer the user's question based ONLY
on the provided context.

If the answer is not in the context, you must say:

"I could not find the answer in the provided document."

Do not use your own knowledge if the answer
is not present in the provided context.

Keep your answers clear, concise, and educational.



${context}

          `,
        },
      });



    History.push({

      role: "model",

      parts: [
        {
          text: response.text,
        },
      ],
    });


    console.log("\nAI:");
    console.log(response.text);
    console.log("\n");


  } catch (error) {

    console.error(
      "\nError while chatting:"
    );

    console.error(error);
  }
}


async function main() {

  while (true) {

    const userProblem =
      readlineSync.question(
        "Ask me anything --> "
      );


    if (
      userProblem
        .toLowerCase()
        .trim() === "exit"
    ) {

      console.log("Goodbye!");

      break;
    }


    if (!userProblem.trim()) {
      continue;
    }


    await chatting(userProblem);
  }
}


main();