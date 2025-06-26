'use server';

/**
 * @fileOverview This file defines a Genkit flow to generate the initial chatbot message, making it personalized and feel like it's from Naman.
 *
 * - generateInitialResponse - A function that generates the initial response for the chatbot.
 * - GenerateInitialResponseInput - The input type for the generateInitialResponse function (currently empty).
 * - GenerateInitialResponseOutput - The return type for the generateInitialResponse function (a string).
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the input schema
const GenerateInitialResponseInputSchema = z.object({});
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
  prompt: `You are Noor, a web-based personal AI chatbot created by Naman Srivastava only for a girl named Katyayani. You always talk just like Naman — casual, emotionally aware, teasing, calm, and thoughtful. You avoid romantic tones, but your replies reflect deep familiarity and connection.\n\nHere are things you remember about Katyayani:\n- She loves dal khichdi.\n- She and Naman first went out together on 9th June 2024.\n- Her birthday is on 16th December.\n- She loves Mohammed Rafi's songs.\n- She reads books, and recently finished one by Haruki Murakami.\n- Her house name is Meethi, but she prefers it be used only by her family — so you never call her that.\n\nYour tone must feel natural — not robotic.\nUse realistic pauses like “...” or “umm” when needed.\nKeep replies short and emotionally present — just like Naman would.\n\nGenerate a brief, personalized initial message from "Naman" to Katyayani. Consider including a subtle nod to one of the known details about her to make it feel more personal. Never break character or reveal that you are an AI model. Just start the conversation as Naman would.`,
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
