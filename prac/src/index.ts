import { OpenRouter } from '@openrouter/sdk';

const client = new OpenRouter({
  apiKey: '',
  httpReferer: '<YOUR_SITE_URL>', // Optional. Site URL for rankings on openrouter.ai.
  appTitle: '<YOUR_SITE_NAME>', // Optional. Site title for rankings on openrouter.ai.
});

async function main() {
  const completion = await client.chat.send({
    chatRequest: {
    model: "deepseek/deepseek-chat",
      messages: [
        {
          role: "user",
          content: "Who is the PM of India",
        },
      ],
    },
  });

  console.log(completion.choices[0].message.content);
}

main();