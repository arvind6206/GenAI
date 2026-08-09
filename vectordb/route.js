import { Router } from "express";
import { getOpenAiClient } from "./openai.js";
import { getDb } from "./db.js";

const router = Router();

router.post("/add-video", async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title || !description) {
      return res.status(400).json({
        msg: "Title and description is required",
      });
    }

    const text = `${title}. ${description}`;
    const openai = getOpenAiClient();

    const embeddings = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: text,
    });

    const vectors = embeddings.data[0].embedding;

    const db = getDb();

    await db.query(
      "INSERT INTO videos (title, description, embeddings) VALUES ($1, $2, $3)",
      [title, description, `[${vectors.join(",")}]`],
    );

    res.status(200).json({
      msg: "Video Added successfully",
    });
  } catch (error) {
    console.log("Error occur during insert", error);
    res.status(500).json({
      msg: "Internal Server Error",
    });
  }
});

router.post("/query-videos", async (req, res) => {
  try {
    const { query, topK } = req.body;
    if (!query || !topK) {
      return res.status(400).json({
        msg: "Query and topK are required",
      });
    }

    const openai = getOpenAiClient();
    const embeddings = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: query,
    });

    const queryVector = embeddings.data[0].embedding;
    const db = getDb();
    const result = await db.query(
      `SELECT id, title, description, embedding <=> $1 AS distance 
            FROM videos
            WHERE embedding <=> $1 < 0.55
             ORDER BY embedding <=> LIMIT $2`,
      [`[${queryVector.join(",")}]`, topK],
    );
    return res.status(200).json({
        videos: result.rows
    })
  } catch (error) {
    console.log("Error occured during query", error);
    res.status(500).json({
      msg: "Internal Server Error",
    });
  }
});

export default router;
