import { streamText, convertToModelMessages, UIMessage } from "ai";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { NextResponse } from "next/server";
import { AISDKError } from "ai";
import { handleAIError } from "@/lib/handle-ai-error"

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const prompt = "Create a list of three open-ended and engagong questions formatted as a single string .Each question should be seperated by '||'. These questions are for an anonymous socila messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoi personal or sensitive topics, focusing intead on universalthemes that encouraged family interaction. For example, your output should be structured like this: 'What's a hobby you've recently started?||If you could have dinner with any historical figure, who wouldit be?||What's a simple thing that makes you happy?'.Ensure the questions are intriguing, foster, curiosity, and contribute to a positive and welcoming conversational environment.   "
    const result = streamText({
      model: openrouter("anthropic/claude-sonnet-4.5"),
      prompt,
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    return handleAIError(error);
  }
}