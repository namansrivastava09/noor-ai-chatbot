"use server";

import {
  generateInitialResponse,
  type GenerateInitialResponseInput,
} from "@/ai/flows/generate-initial-response";
import {
  generateResponse,
  type GenerateResponseInput,
} from "@/ai/flows/generate-response-from-message";
import type { Message } from "@/lib/types";

function getCurrentTime(): string {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

export async function getInitialMessage(): Promise<Message> {
  const input: GenerateInitialResponseInput = {
    currentTime: getCurrentTime(),
  };
  const content = await generateInitialResponse(input);
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
    currentTime: getCurrentTime(),
  };

  const result = await generateResponse(input);

  return {
    id: crypto.randomUUID(),
    role: "assistant",
    content: result.response,
  };
}
