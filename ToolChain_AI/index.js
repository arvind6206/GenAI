import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();

const client = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const response = await client.interactions.create({
  model: "gemini-3.6-flash",
  input: "what is weather in Ranchi?",

  tools: [
    {
      type: "function",
      name: "calculator",
      description: "Perform basic mathematical calculations",
      parameters: {
        type: "object",
        properties: {
          a: {
            type: "number",
          },
          b: {
            type: "number",
          },
          operation: {
            type: "string",
            enum: ["add", "subtract", "multiply", "divide"],
          },
        },
        required: ["a", "b", "operation"],
      },
    },

    {
      type: "function",
      name: "getWeather",
      description: "Get the current weather information for a city",
      parameters: {
        type: "object",

        properties: {
          city: {
            type: "string",
            description: "The name of the city",
          },
        },
        required: ["city"],
      },
    },
  ],
});

const toolCall = response.steps.find((step) => step.type === "function_call");

if (toolCall) {
  console.log("Tool called:", toolCall.name);
  console.log("Arguments:", toolCall.arguments);

  const args = toolCall.arguments;

  let result;

  if (toolCall.name === "calculator") {
    result = calculator(args.a, args.b, args.operation);
  } else if (toolCall.name === "getWeather") {
    result = await getWeather(args.city);
  }

  console.log("Tool result:", result);
}

function calculator(a, b, operation) {
  switch (operation) {
    case "add":
      return a + b;
    case "subtract":
      return a - b;
    case "multiply":
      return a * b;

    case "divide":
      if (b == 0) {
        throw new Error("can not divide by zero");
      }
      return a / b;
    default:
      throw new Error("Invalid operation");
  }
}

async function getWeather(city) {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${process.env.WEATHER_API_KEY}&units=metric`,
  );

  if (!response.ok) {
    throw new Error(`Weather API error: ${response.status}`);
  }

  const data = await response.json();

  return {
    city: city,
    temperature: data.main.temp,
    condition: data.weather[0].description,
    humidity: data.main.humidity,
  };
}
