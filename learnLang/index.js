// import express from "express";
// import dotenv from "dotenv";
// import { GoogleGenAI } from "@google/genai";
// import {ChatGoogleGenerativeAI} from '@langchain/google-genai'
// import {Annotation, MessagesAnnotation, StateGraph} from '@langchain/langgraph'
// import { AIMessage } from "@langchain/core/messages";
// import {ToolNode} from '@langchain/langgraph/prebuilt'
// import { TavilySearch } from "@langchain/tavily";
// import {ChatGroq} from '@langchain/groq'

// dotenv.config();

// const app = express();
// app.use(express.json());
// const port = 3000;
 
// //with langchain

// const tool = new TavilySearch({
//   maxResults: 1,
//   topic: "general",
  
// });


// const tools = [tool]
// const toolNode = new ToolNode(tools)

// const llm = new ChatGroq({
//     model: "openai/gpt-oss-20b",
//     temperature: 0,
// }).bindTools(tools)



// const callLLM = async (state) => {
//     console.log("state: ", state)
//     const response = await llm.invoke(state.messages[0].content)

//     return {messages: [response]}
// }


// const shouldContinue = async (state) => {
//     const lastMessages = state.messages[state.messages.length - 1]
//     if(lastMessages.tool_calls.length > 0){
//         return "tools"
//     } else {
//         return END
//     }
// }


// const graph = new StateGraph(MessagesAnnotation)
// .addNode("agent", callLLM)
// .addNode("tools", toolNode)
// .addEdge("__start__", "agent")
// // .addEdge("agent", "__end__")
// .addEdge("tools", "agent")
// .addConditionalEdges("agent", shouldContinue)
// .compile()



// app.post('/ai', async(req, res) => {
//     const {input} = req.body

//     const response = await graph.invoke({messages: [
//         {role: "user", 
//         content: input}
//     ]})

//     console.log(response)


//     return res.status(200).json({
//         "ai": response.messages[response.messages.length - 1].content
//     })
// })






// app.listen(port, () => {
//   console.log(`Server is listening on http://localhost:${port}`);
// });






import express from "express";
import dotenv from "dotenv";

import { ChatGroq } from "@langchain/groq";
import {
  StateGraph,
  MessagesAnnotation,
  START,
  END,
} from "@langchain/langgraph";

import { ToolNode } from "@langchain/langgraph/prebuilt";
import { TavilySearch } from "@langchain/tavily";

dotenv.config();

const app = express();

app.use(express.json());

const port = 3000;



const tool = new TavilySearch({
  maxResults: 1,
  topic: "general",
});

const tools = [tool];

const toolNode = new ToolNode(tools);



const llm = new ChatGroq({
  model: "openai/gpt-oss-20b",
  temperature: 0,
}).bindTools(tools);


const callLLM = async (state) => {
  console.log("Calling LLM...");

  console.log("Messages:");
  console.log(state.messages);

  const response = await llm.invoke(state.messages);

  console.log("LLM response:");
  console.log(response);

  console.log("Tool calls:");
  console.log(response.tool_calls);

  return {
    messages: [response],
  };
};



const shouldContinue = (state) => {
  const lastMessage = state.messages[state.messages.length - 1];

  console.log("Checking next step...");
  console.log("Tool calls:", lastMessage.tool_calls);

  if (lastMessage.tool_calls?.length > 0) {
    console.log("➡️ Going to tools");

    return "tools";
  }

  console.log("➡️ Going to END");

  return END;
};



const graph = new StateGraph(MessagesAnnotation)

  .addNode("agent", callLLM)
  .addNode("tools", toolNode)

  .addEdge(START, "agent")

  .addConditionalEdges("agent", shouldContinue)

  .addEdge("tools", "agent")

  .compile();


app.post("/ai", async (req, res) => {
  try {
    const { input } = req.body;

    if (!input) {
      return res.status(400).json({
        error: "Input is required",
      });
    }

    console.log("User input:", input);

    const response = await graph.invoke({
      messages: [
        {
          role: "user",
          content: input,
        },
      ],
    });

    console.log("Final graph response:");
    console.log(response);

    const lastMessage =
      response.messages[response.messages.length - 1];

    return res.status(200).json({
      ai: lastMessage.content,
    });
  } catch (error) {
    console.error("AI Error:", error);

    return res.status(500).json({
      error: error.message,
    });
  }
});



app.listen(port, () => {
  console.log(`Server is listening on http://localhost:${port}`);
});