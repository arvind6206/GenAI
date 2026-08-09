import express from "express";
import dotenv from "dotenv";
import router from "./route.js";
import { connectToDB } from "./db.js";
import { configOpenAi } from "./openai.js";
dotenv.config();

const app = express();
app.use(express.json());
const PORT = process.env.PORT;

app.use("/api/v1", router);

async function run() {
  try {
    await connectToDB();
    configOpenAi();

    app.listen(PORT, () => {
      console.log(`Server is listening on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log("Error during initailizing app")
  }
}

run()