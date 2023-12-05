import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY as string,
});

export const runtime = "edge";

export async function POST(request: Request) {
  console.log("TRIGGER PROMPT HANDLER");
  const { prompt } = await request.json();
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    stream: true,
    messages: [
      {
        role: "system",
        content:
          "You are a knowledgeable nutritionist, skilled in creating personalized meal plans.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.1,
    top_p: 1,
  });
  const stream = OpenAIStream(response);
  return new StreamingTextResponse(stream);
}
