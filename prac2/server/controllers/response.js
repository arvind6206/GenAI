import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.API_KEY,
});

export const aiResponseController = async (req, res) => {
  try {
    const { question } = req.body;
    if (!question) {
      return res.status(400).json({
        msg: "Quetion is required",
      });
    }
    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: question,

      config: {
        systemInstruction: `
    You are a DSA(Data Structure and algorithm) instructor.
    - Give me the answer in a formatted way.
    - Don't use technical jargon until needed.
    - Give me the answers in 100 words.
    - Give me the answer in bullet points

    If user ask anything other than DSA topic then reply in a very rude manner
    `,
      },
    });
    return res.status(200).json({
      response: response.text,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      msg: "Internal Server Error",
    });
  }
};
