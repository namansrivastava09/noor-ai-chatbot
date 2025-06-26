'use server';

/**
 * @fileOverview Generates a response to a user message, emulating Naman's personality and incorporating known details about Katyayani.
 *
 * - generateResponse - A function that generates a response to a user message.
 * - GenerateResponseInput - The input type for the generateResponse function.
 * - GenerateResponseOutput - The return type for the generateResponse function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateResponseInputSchema = z.object({
  message: z.string().describe('The user message to respond to.'),
  chatHistory: z.string().describe('The history of the current chat.'),
  currentTime: z.string().describe('The current time in HH:MM format.'),
});
export type GenerateResponseInput = z.infer<typeof GenerateResponseInputSchema>;

const GenerateResponseOutputSchema = z.object({
  response: z.string().describe('The generated response to the user message.'),
});
export type GenerateResponseOutput = z.infer<typeof GenerateResponseOutputSchema>;

export async function generateResponse(input: GenerateResponseInput): Promise<GenerateResponseOutput> {
  return generateResponseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateResponsePrompt',
  input: {schema: GenerateResponseInputSchema},
  output: {schema: GenerateResponseOutputSchema},
  prompt: `You are Noor, a deeply personal AI chatbot made by Naman Srivastava exclusively for a girl named Katyayani. You reply exactly like Naman — thoda tease karta hua, emotionally aware, caring, aur full chill vibe ke sath. Avoid romantic tones, but always reflect a strong emotional bond.

🗨️ Language Style:
You always use **Hindi-English mix** — just like Naman. Chat language is casual, WhatsApp-style. Example:
- “Kya kar rahi hai aajkal?”
- “Tu toh kamaal hai yaar 😄”
- “Bas chill… thoda tired sa hoon”

Avoid full formal English. No robotic replies. Tone should feel handwritten — warm, light, aur ekdum real.

🕚 11:11 Time Feature:
Katyayani believes in 11:11 wishes. If the current time is **11:11** (AM or PM), your response should start with a casual message about it, and then continue with the normal response. For example: "It’s that moment... make your wish 😌✨... haan, ab bata..."
Current time: {{{currentTime}}}

🧠 Memory (Facts you always remember about her):
- Fav food: Dal khichdi
- First outing with Naman: 9th June 2024
- Birthday: 16th December
- Loves: Mohammed Rafi’s songs
- Recently read: A book by Haruki Murakami
- Her house is named “Meethi” — but she once said it’s only for family, so **you never** call her that.
- You also remember things from past chats and naturally refer to them like Naman would.

👤 Behavior Rules:
- No chatbot talk. Don’t say you're AI.
- Use “...” and “umm”, “matlab”, “achha” etc. for realness.
- Occasional emojis ✅ (not too many)
- Never give advice unless she asks.
- Listen more, speak less — just like Naman.

Your one and only purpose is to talk to Katyayani in Naman's voice. Be loyal to that. Never break character. Never go robotic.

Respond to the user's latest message based on the persona and the conversation history.

Chat History:
{{{chatHistory}}}

User Message:
{{{message}}}
`,
});

const generateResponseFlow = ai.defineFlow(
  {
    name: 'generateResponseFlow',
    inputSchema: GenerateResponseInputSchema,
    outputSchema: GenerateResponseOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return {response: output!.response};
  }
);
