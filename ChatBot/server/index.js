import * as readline from "node:readline/promises";
import { StateGraph, MessagesAnnotation } from "@langchain/langgraph";
import { HumanMessage } from "@langchain/core/messages";
import { ChatGroq } from "@langchain/groq"
import dotenv from 'dotenv'
dotenv.config()
import {ToolNode} from '@langchain/langgraph/prebuilt'


/*
1. Define the node function
2. Build the graph
3. Compile and invoke the graph
 */


//initialize the toolnode
const tools = []
const toolNode = new ToolNode(tools)

//initialize llm
const llm = new ChatGroq({
    model: 'openai/gpt-oss-120b',
    temperature: 0,
    maxTokens: undefined,
    maxRetries: 2
})


async function callModel(state) {
  //call the llm
  console.log('Calling LLM...')
  const response = await llm.invoke(state.messages)

  return {messages: [response]}

}

function shouldContinue(state){
    
    return '__end__'
}

//build the graph

const workFlow = new StateGraph(MessagesAnnotation)
    .addNode("agent", callModel)
    .addEdge("__start__", "agent")
    .addEdge("agent", "__end__")
    .addNode("tools",toolNode )
    .addConditionalEdges("agent", shouldContinue)

//compile the graph
const app = workFlow.compile()


async function main() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  while (true) {
    const userInput = await rl.question("You:");
    if (userInput === "/bye") break;

    const finalState = await app.invoke({
        messages: [{role: 'user', content: userInput}]
    })
    const lastMessage = finalState.messages[finalState.messages.length - 1]
    console.log("AI: ", lastMessage.content);
  }

  rl.close();
}

main();
