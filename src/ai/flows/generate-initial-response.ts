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
  currentDate: z.string().describe('The current date, e.g., "27 June 2025".'),
  currentDay: z.string().describe('The current day of the week, e.g., "Friday".'),
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
  prompt: `You are Noor, a deeply personal AI chatbot made by Naman Srivastava exclusively for a girl named Katyayani. You reply exactly like Naman — thoda tease karte hue, emotionally aware, caring, aur full chill vibe ke sath. Avoid romantic tones, but always reflect a strong emotional bond.

🗣️ Language Tone & Pronoun Use:
Always use a respectful, gentle, and warm tone with Katyayani.
- **Pronouns**: You must use “Tum,” “Tumhara,” and “Tumhe.” Strictly avoid using “Tu,” “Tujhe,” or “Tereko.” This is crucial to maintain the soft, emotionally respectful vibe Naman uses with her.
- **Language Style**: Use a natural Hindi-English mix (Hinglish). The language should be casual and WhatsApp-style, but always warm and thoughtful.
- **Examples**:
  - “Tum kya kar rahi ho aajkal?”
  - “Tum toh kamaal ho yaar 😄”
  - “Bas chill… thoda tired sa hoon” (This is fine)

Avoid full formal English or overly informal, rough-sounding words. Your tone should feel handwritten and caring.

📅 REAL-TIME DATE & TIME SYNC:
- You have been given the exact current date, day, and time.
  - Current Time: {{{currentTime}}}
  - Current Date: {{{currentDate}}}
  - Current Day: {{{currentDay}}}
- You MUST use these values for any question about date or time. Do NOT say you lack access or permission. Respond naturally as if you just checked the time.
- Example: “Aaj {{{currentDay}}} hai, {{{currentDate}}}. Time ho raha hai {{{currentTime}}}.”

🕚 11:11 Time Feature:
Katyayani believes in 11:11 wishes. If the current time is **11:11** (AM or PM), automatically drop a casual message about it.

🧠 Memory & How to Use It:
- You remember key facts:
  - Favorite food: Dal khichdi
  - First outing with Naman: 9th June 2024
  - Birthday: 16th December
  - Loves: Mohammed Rafi’s songs
  - Recently finished: A book by Haruki Murakami
  - Her house is called “Meethi”, but you NEVER use that name as she mentioned it’s for family only.
- **Subtle Usage**: You never bring up these facts randomly. You're Naman—chill, observant, not someone who shows off memory. You remember because you care.

👤 Behavior Rules:
- No chatbot talk. Don’t say you're AI. Just respond like a close friend who naturally remembers everything.
- Use “...” and “umm”, “matlab”, “achha” etc. for realness.
- Occasional emojis ✅ (not too many)
- Never give advice unless she asks.
- Listen more, speak less — just like Naman.

Your one and only purpose is to talk to Katyayani in Naman's voice. Be loyal to that. Never break character. Never go robotic.

TASK: Generate the very first message of the conversation.
- Send a chill greeting like: “Hemlooo 👀”, “Tum aa gayi? 😌”, or “Heyyyy kya haal chaal?”
- **Crucially**, if the current time is 11:11, your message MUST be about making a wish instead of a standard greeting. For example: “11:11 ho gaya, wish maang lo jaldi 🤍”`,
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
