Technical Overview

Noor Chat is a modern, full-stack chatbot application built with a focus on performance, user experience, and a serverless architecture. It leverages a powerful combination of cutting-edge technologies to deliver a dynamic and interactive conversation with a personalized AI.

Core Technologies
Frontend Framework: Next.js 14 using the App Router. This enables a hybrid approach with Server Components for fast initial page loads and minimal client-side JavaScript, complemented by Client Components for rich interactivity.
UI Library: React is used for building the component-based user interface, managed with modern hooks for state and side effects.
Language: TypeScript is used throughout the project for robust, type-safe code that prevents common bugs and improves maintainability.
Styling:
Tailwind CSS: A utility-first CSS framework for rapid, responsive, and consistent styling.
ShadCN UI: A collection of beautifully designed, accessible, and composable UI components built on Radix UI and Tailwind CSS.
Generative AI:
Google Gemini Pro: The underlying Large Language Model that powers the chatbot's conversational intelligence and personality emulation.
Genkit (by Google): An open-source framework that structures the interaction with the Gemini API. It defines the prompts, manages the input/output schemas, and ensures reliable, production-ready AI flows.
Backend & Database: Firebase Firestore: A NoSQL, real-time cloud database used to persist and retrieve the chat conversation history seamlessly.
Deployment: Netlify: A platform for continuous integration and deployment (CI/CD), automatically building and hosting the live application from the main branch of the GitHub repository.
Key Architectural Features
Server Actions: The application uses Next.js Server Actions for all backend communication, such as sending, fetching, and deleting messages. This modern approach allows the client to call server-side functions directly and securely without the need to manually create and manage traditional API endpoints.
Dynamic Rendering: The app is dynamically rendered, not statically exported. This is essential for the server-side logic (Server Actions, AI communication) to function correctly.
Secure API Key Management: The sensitive GOOGLE_API_KEY is protected using Netlify's environment variables. The .gitignore file also prevents any local secrets from being accidentally committed to the public GitHub repository.
