import * as readline from "node:readline/promises";
import { MemorySaver, StateGraph, MessagesAnnotation } from "@langchain/langgraph";
import { HumanMessage } from "@langchain/core/messages";
import { ChatGroq } from "@langchain/groq"
import dotenv from 'dotenv'
dotenv.config()
import {ToolNode} from '@langchain/langgraph/prebuilt'
import {TavilySearch} from '@langchain/tavily'


/*
1. Define the node function
2. Build the graph
3. Compile and invoke the graph
 */

//memory
const checkPointer = new MemorySaver()


//taveli

const tool = new TavilySearch({
    maxResults: 2,
    topic: 'general'
})


//initialize the toolnode
const tools = [tool]
const toolNode = new ToolNode(tools)

//initialize llm
const llm = new ChatGroq({
    model: 'openai/gpt-oss-120b',
    temperature: 0,
    maxTokens: undefined,
    maxRetries: 2
}).bindTools(tools)


async function callModel(state) {
  //call the llm
  console.log('Calling LLM...')
  const response = await llm.invoke(state.messages)

  return {messages: [response]}

}

function shouldContinue(state){
    const lastMessage = state.messages[state.messages.length - 1]
    if(lastMessage.tool_calls.length > 0){
        return 'tools'
    }
    return "__end__"
}

//build the graph

const workFlow = new StateGraph(MessagesAnnotation)
    .addNode("agent", callModel)
    .addEdge("__start__", "agent")
    .addEdge("tools", "agent")
    .addNode("tools",toolNode )
    .addConditionalEdges("agent", shouldContinue)

//compile the graph
const app = workFlow.compile({checkpointer: checkPointer})


async function main() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  while (true) {
    const userInput = await rl.question("You:");
    if (userInput === "/bye") break;

    const finalState = await app.invoke({
        messages: [{role: 'user', content: userInput}],

    }, {configurable: { thread_id: "1" }})
    const lastMessage = finalState.messages[finalState.messages.length - 1]
    console.log("AI: ", lastMessage.content);
  }

  rl.close();
}

main();
