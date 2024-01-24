import OpenAI from "openai";

export async function generateContent(instance, prompt, tokens) {
  const completion = await instance.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
    temperature: 1,
    // max_tokens: tokens,
    top_p: 1,
  });
  return completion.choices[0].message.content;
}

export async function createInstance(apiKey, orgId) {
  const openai = new OpenAI({
    organization: orgId,
    apiKey: apiKey,
  });

  return openai;
}
