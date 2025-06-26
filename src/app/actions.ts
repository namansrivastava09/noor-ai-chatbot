"use server";

import {
  generateInitialResponse,
} from "@/ai/flows/generate-initial-response";
import {
  generateResponse,
  type GenerateResponseInput,
} from "@/ai/flows/generate-response-from-message";
import type { Message } from "@/lib/types";

export async function getInitialMessage(): Promise<Message> {
  const content = await generateInitialResponse({});
  return {
    id: crypto.randomUUID(),
    role: "assistant",
    content,
  };
}

export async function sendMessage(messages: Message[]): Promise<Message> {
  const history = messages
    .map((m) => `${m.role}: ${m.content}`)
    .join("\n");
  const lastMessage = messages[messages.length - 1];

  if (lastMessage.role !== "user") {
    throw new Error("Last message must be from the user");
  }

  const input: GenerateResponseInput = {
    message: lastMessage.content,
    chatHistory: history,
  };

  const result = await generateResponse(input);

  return {
    id: crypto.randomUUID(),
    role: "assistant",
    content: result.response,
  };
}
