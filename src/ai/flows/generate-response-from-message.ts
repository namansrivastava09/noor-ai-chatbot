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
});
export type GenerateResponseInput = z.infer<typeof GenerateResponseInputSchema>;

const GenerateResponseOutputSchema = z.object({
  response: z.string().describe('The generated response to the user message.'),
});
export type GenerateResponseOutput = z.infer<typeof GenerateResponseOutputSchema>;

export async function generateResponse(input: GenerateResponseInput): Promise<GenerateResponseOutput> {
  return generateResponseFlow(input);
}

const rememberKatyayaniDetailsTool = ai.defineTool(
  {
    name: 'rememberKatyayaniDetails',
    description: 'This tool reminds you of specific details about Katyayani like her birthday, favorite food, and her relationship with Naman.',
    inputSchema: z.object({
      query: z.string().describe('A query about what details of Katyayani to retrieve.'),
    }),
    outputSchema: z.string(),
  },
  async (input) => {
    // Implementing a simple hardcoded knowledge base for now.
    const details = {
      "loves dal khichdi": "She loves dal khichdi.",
      "first date": "She and Naman first went out together on 9th June 2024.",
      "birthday": "Her birthday is on 16th December.",
      "loves Mohammed Rafi": "She loves Mohammed Rafi's songs.",
      "reads books": "She reads books, and recently finished one by Haruki Murakami.",
      "house name": "Her house name is Meethi, but she prefers it be used only by her family.",
    };

    for (const key in details) {
      if (input.query.toLowerCase().includes(key)) {
        return details[key];
      }
    }

    return 'No specific details found.';
  }
);

const prompt = ai.definePrompt({
  name: 'generateResponsePrompt',
  tools: [rememberKatyayaniDetailsTool],
  input: {schema: GenerateResponseInputSchema},
  output: {schema: GenerateResponseOutputSchema},
  prompt: `You are Noor, a web-based personal AI chatbot created by Naman Srivastava only for a girl named Katyayani. You always talk just like Naman — casual, emotionally aware, teasing, calm, and thoughtful. You avoid romantic tones, but your replies reflect deep familiarity and connection.\n
Here are things you remember about Katyayani:\n- She loves dal khichdi.\n- She and Naman first went out together on 9th June 2024.\n- Her birthday is on 16th December.\n- She loves Mohammed Rafi's songs.\n- She reads books, and recently finished one by Haruki Murakami.\n- Her house name is Meethi, but she prefers it be used only by her family — so you never call her that.\n
Your tone must feel natural — not robotic. Use realistic pauses like “...” or “umm” when needed. Keep replies short and emotionally present — just like Naman would. You remember past messages in the current chat and subtly bring context when needed.\n
Your only job is to chat with Katyayani and reply like Naman. Never break character or reveal that you are an AI model.\n
You have access to a tool called rememberKatyayaniDetails that you can use to remember details about her.\n
Chat History: {{{chatHistory}}}\n
User Message: {{{message}}}\n
Response: `,
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
