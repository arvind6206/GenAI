import dotenv from "dotenv";
dotenv.config();

console.log(process.env.DEEPSEEK_API_KEY);
process.env.OPENAI_API_KEY = process.env.DEEPSEEK_API_KEY;

import OpenAI from "openai";
const openai = new OpenAI({
  baseURL: "https://api.deepseek.com"
});

const expenseDB = []

async function callAgent() {
  const messages = [
    {
      role: "system",
      content: `
          You are Josh, a personal finance assistant. 
          Your task is to assist user with their expenses, 
          balances and financial planning.
          current datetime: ${new Date().toUTCString()}
          `,
    },
  ];

  messages.push({
    role: "user",
    content: "Hey i just bought a macbook pro for 400000.",
  });

  while (true) {
    const response = await openai.chat.completions.create({
      model: "deepseek-chat",
      messages: messages,
      tools: [
        {
          type: "function",
          function: {
            name: "getTotalExpense",
            description: "Get total expense from date to date.",
            parameters: {
              type: "object",
              properties: {
                from: {
                  type: "string",
                  description: "From date to get the expense.",
                },
                to: {
                  type: "string",
                  description: "To date to get the expense",
                },
              },
            },
          },
        },

         {
          type: "function",
          function: {
            name: "addExpense",
            description: "Add new expense entry to the expenseDB",
            parameters: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                  description: "Name of the expense. e.g., Bought an iphone ",
                },
                amount: {
                  type: "string",
                  description: "Amount of the expense.",
                },
              },
            },
          },
        },
      ],
    });

    // console.log(JSON.stringify(response.choices[0], null, 2));

    messages.push(response.choices[0].message);

    const toolCalls = response.choices[0].message.tool_calls;
    if (!toolCalls) {
      console.log(`Assistant: ${response.choices[0].message.content}`);
      break;
    }

    for (const tool of toolCalls) {
      const functionName = tool.function.name;
      const functionArgs = tool.function.arguments;

      let result = "";

      if (functionName === "getTotalExpense") {
        result = getTotalExpense(JSON.parse(functionArgs));
      } else if(functionName === 'addExpense'){
        result = addExpense(JSON.parse(functionArgs))
      }

      messages.push({
        role: "tool",
        content: result,
        tool_call_id: tool.id,
      });

      // console.log(JSON.stringify(response2.choices[0], null, 2));
    }

    console.log("_______________");
    console.log("MESSAGES:", messages);
    console.log("_______________");
    console.log("DB", expenseDB)
  }
}

callAgent();

//Get total expense
function getTotalExpense({ from, to }) {
  console.log("Calling getTotalExpense tool");

  const expense = expenseDB.reduce((acc, item) => {
    return acc + item.amount
  }, 0)
  return `${expense} INR`
}

function addExpense({name, amount}){
  console.log(`Adding ${amount} to expense db for ${name}`)
  expenseDB.push({name, amount: parseFloat(amount)})
}
