import express from "express";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import {ChatGoogleGenerativeAI} from '@langchain/google-genai'
dotenv.config();

const app = express();
app.use(express.json());
const port = 3000;
 

// without langchain

// const ai = new GoogleGenAI({
//   apiKey: process.env.GEMINI_API_KEY,
// });

// app.post("/ai", async (req, res) => {
//   const { input } = req.body;
//   const response = await ai.models.generateContent({
//     model: "gemini-3.6-flash",
//     contents: [
//       {
//         role: "user",
//         parts: [
//           {
//             text: input,
//           },
//         ],
//       },
//     ],
//     config: {
//         systemInstruction: "you are an ai assistant and your name is jarvis"
//     }
//   });

//   return res.status(200).json({
//     "ai:": response.text,
//   });
// });



//with langchain

const llm = new ChatGoogleGenerativeAI({
    model: "gemini-3.6-flash"
})

app.post('/ai', async(req, res) => {
    const {input} = req.body

    const response = await llm.invoke(input)

    return res.status(200).json({
        "ai": response.content
    })
})


app.listen(port, () => {
  console.log(`Server is listening on http://localhost:${port}`);
});
