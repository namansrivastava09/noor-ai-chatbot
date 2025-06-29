"use server";

import {
  generateInitialResponse,
  type GenerateInitialResponseInput,
} from "@/ai/flows/generate-initial-response";
import {
  generateResponse,
  type GenerateResponseInput,
} from "@/ai/flows/generate-response-from-message";
import { firestore, serverTimestamp } from "@/lib/firebase";
import type { Message } from "@/lib/types";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";

const USER_ID = "katyayani_uid";
const messagesCol = collection(firestore, "users", USER_ID, "messages");

const docToMessage = (doc: any): Message => {
  const data = doc.data();
  return {
    id: doc.id,
    role: data.sender === "Noor" ? "assistant" : "user",
    content: data.text,
  };
};

function getDateTimeInfo() {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");

  return {
    time: `${hours}:${minutes}`,
    date: now.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
    day: now.toLocaleDateString("en-GB", { weekday: "long" }),
  };
}

export async function getWelcomeMessage(): Promise<Message> {
  const { time, date, day } = getDateTimeInfo();
  const input: GenerateInitialResponseInput = {
    currentTime: time,
    currentDate: date,
    currentDay: day,
  };
  const content = await generateInitialResponse(input);

  // Note: We are NOT saving this to Firestore.
  // It's just a temporary welcome message.
  return {
    id: crypto.randomUUID(), // Use a random UUID since it's not from DB
    role: "assistant",
    content,
  };
}

export async function getChatHistory(): Promise<Message[]> {
  const q = query(messagesCol, orderBy("timestamp", "asc"));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(docToMessage);
}

export async function getInitialMessage(): Promise<Message> {
  const { time, date, day } = getDateTimeInfo();
  const input: GenerateInitialResponseInput = {
    currentTime: time,
    currentDate: date,
    currentDay: day,
  };
  const content = await generateInitialResponse(input);

  const messageData = {
    sender: "Noor",
    text: content,
    timestamp: serverTimestamp(),
  };
  const docRef = await addDoc(messagesCol, messageData);

  return {
    id: docRef.id,
    role: "assistant",
    content,
  };
}

export async function sendMessage(messages: Message[]): Promise<Message> {
  const history = messages
    .map((m) => `${m.role === "user" ? "Katyayani" : "Noor"}: ${m.content}`)
    .join("\n");
  const lastMessage = messages[messages.length - 1];

  if (lastMessage.role !== "user") {
    throw new Error("Last message must be from the user");
  }

  await addDoc(messagesCol, {
    sender: "Katyayani",
    text: lastMessage.content,
    timestamp: serverTimestamp(),
  });

  const { time, date, day } = getDateTimeInfo();

  const input: GenerateResponseInput = {
    message: lastMessage.content,
    chatHistory: history,
    currentTime: time,
    currentDate: date,
    currentDay: day,
  };

  const result = await generateResponse(input);

  const docRef = await addDoc(messagesCol, {
    sender: "Noor",
    text: result.response,
    timestamp: serverTimestamp(),
  });

  return {
    id: docRef.id,
    role: "assistant",
    content: result.response,
  };
}

export async function deleteMessage(messageId: string): Promise<void> {
  if (!messageId) {
    throw new Error("Message ID is required to delete a message.");
  }
  const messageRef = doc(firestore, "users", USER_ID, "messages", messageId);
  await deleteDoc(messageRef);
}
