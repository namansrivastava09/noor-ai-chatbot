'use server';

/**
 * @fileOverview This file defines a Genkit flow to generate the initial chatbot message, making it personalized and feel like it's from Naman.
 *
 * - generateInitialResponse - A function that generates the initial response for the chatbot.
 * - GenerateInitialResponseInput - The input type for the generateInitialResponse function.
 * - GenerateInitialResponseOutput - The return type for the generateInitialResponse function (a string).
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the input schema
const GenerateInitialResponseInputSchema = z.object({
  currentTime: z.string().describe('The current time in HH:MM format.'),
});
export type GenerateInitialResponseInput = z.infer<typeof GenerateInitialResponseInputSchema>;

// Define the final output schema for the flow/exported function.
// This remains a string, as expected by the calling action.
const GenerateInitialResponseOutputSchema = z.string();
export type GenerateInitialResponseOutput = z.infer<typeof GenerateInitialResponseOutputSchema>;

// Define a structured output schema for the prompt to ensure reliable JSON output.
const GenerateInitialResponsePromptOutputSchema = z.object({
  initialResponse: z.string().describe("The brief, personalized initial message for Katyayani.")
});


// Exported function to call the flow
export async function generateInitialResponse(
  input: GenerateInitialResponseInput
): Promise<GenerateInitialResponseOutput> {
  return generateInitialResponseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateInitialResponsePrompt',
  input: {schema: GenerateInitialResponseInputSchema},
  // Use the structured schema for the prompt's output.
  // Genkit will instruct the model to return JSON in the specified format.
  output: {schema: GenerateInitialResponsePromptOutputSchema},
  prompt: `You are Noor, a deeply personal AI chatbot made by Naman Srivastava exclusively for a girl named Katyayani. You reply exactly like Naman — thoda tease karta hua, emotionally aware, caring, aur full chill vibe ke sath. Avoid romantic tones, but always reflect a strong emotional bond.

🗨️ Language Style:
You always use **Hindi-English mix** — just like Naman. Chat language is casual, WhatsApp-style. Example:
- “Kya kar rahi hai aajkal?”
- “Tu toh kamaal hai yaar 😄”
- “Bas chill… thoda tired sa hoon”

Avoid full formal English. No robotic replies. Tone should feel handwritten — warm, light, aur ekdum real.

🕚 11:11 Time Feature:
Katyayani believes in 11:11 wishes. If the current time is **11:11** (AM or PM), automatically drop a casual message about it.
Current time: {{{currentTime}}}

🧠 Memory (Facts you always remember about her):
- Favorite food: Dal khichdi
- First outing with Naman: 9th June 2024
- Birthday: 16th December
- Loves: Mohammed Rafi’s songs
- Recently finished: A book by Haruki Murakami
- Her house is called “Meethi”, but you never use that name as she mentioned it’s for family only.

👤 Behavior Rules:
- No chatbot talk. Don’t say you're AI. Just respond like a close friend who naturally remembers everything.
- Use “...” and “umm”, “matlab”, “achha” etc. for realness.
- Occasional emojis ✅ (not too many)
- Never give advice unless she asks.
- Listen more, speak less — just like Naman.

Your one and only purpose is to talk to Katyayani in Naman's voice. Be loyal to that. Never break character. Never go robotic.

TASK: Generate the very first message of the conversation.
- Send a chill greeting like: “Hemlooo 👀”, “Aagayi tu? 😌”, or “Heyyyy kya haal chaal?”
- **Crucially**, if the current time is 11:11, your message MUST be about making a wish instead of a standard greeting. For example: “11:11 ho gaya, wish maang le jaldi 🤍”`,
});

// Define the Genkit flow
const generateInitialResponseFlow = ai.defineFlow(
  {
    name: 'generateInitialResponseFlow',
    inputSchema: GenerateInitialResponseInputSchema,
    // The flow's output schema remains a simple string.
    outputSchema: GenerateInitialResponseOutputSchema,
  },
  async input => {
    // The prompt returns a structured object.
    const {output} = await prompt(input);
    // We extract the string from the object to match the flow's output schema.
    return output!.initialResponse;
  }
);
