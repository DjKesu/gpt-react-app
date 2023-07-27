import { Configuration, OpenAIApi } from "openai";

export async function generateContent(instance, prompt) {
  const completion = await instance.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
    temperature: 1,
    max_tokens: 2048,
    top_p: 1,
  });
  return completion.data.choices[0].message.content;
}

export async function createInstance(apiKey, orgId) {
  const openAiConfig = new Configuration({
    organization: orgId,
    apiKey: apiKey,
  });

  const openAiApi = new OpenAIApi(openAiConfig);
  return openAiApi;
}
