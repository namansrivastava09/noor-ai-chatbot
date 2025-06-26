# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

## Deploying to Vercel

Vercel is a platform from the creators of Next.js that makes it very easy to deploy Next.js applications for free.

### Step 1: Get your Google AI API Key

Your chatbot uses Google's Generative AI (Gemini). To use it on Vercel, you need to provide an API key.

1.  Go to [Google AI Studio](https://aistudio.google.com/).
2.  Click on "Get API key" and create a new key in your Google Cloud project.
3.  Copy this key. You will need it in Step 4.

### Step 2: Download and Unzip Your Project

To move your code to GitHub and Vercel, you first need to download it from Firebase Studio.

1.  **Find the Download Button:** In the top bar of the Firebase Studio interface, you will see a **"Download code"** button.
2.  **Download the ZIP File:** Click this button. Your browser will download a single `.zip` file containing your entire project (e.g., `noor-ai-chatbot.zip`). This file will likely be in your computer's "Downloads" folder.
3.  **Unzip the Project:** Find the downloaded `.zip` file on your computer and extract its contents.
    *   On **Windows**, right-click the file and choose "Extract All...".
    *   On a **Mac**, simply double-click the file.
4.  This will create a new folder with all of your project files inside. This folder is what you will use in Step 3.

### Step 3: Push to GitHub

Vercel deploys directly from a Git repository.

1.  Go to [GitHub](https://github.com) and create a new, empty repository. Do **not** initialize it with a README or license file.
2.  Open a terminal or command prompt on your computer and navigate into your downloaded project folder (the one you unzipped in Step 2).
3.  Run the following commands, replacing `<your-github-repo-url>` with the URL of the repository you just created:

    ```bash
    git init
    git add .
    git commit -m "Initial commit"
    git branch -M main
    git remote add origin <your-github-repo-url>
    git push -u origin main
    ```

### Step 4: Deploy on Vercel

1.  Sign up for a [Vercel](https://vercel.com) account (it's easiest to sign up with your GitHub account).
2.  On your Vercel dashboard, click "Add New..." and select "Project".
3.  Find the GitHub repository you just created and click "Import".
4.  Vercel will recognize it as a Next.js project. Before deploying, expand the "Environment Variables" section.
5.  Add a new variable:
    *   **Name:** `GOOGLE_API_KEY`
    *   **Value:** Paste the API key you copied from Google AI Studio in Step 1.
6.  Click "Deploy".

That's it! Vercel will build and deploy your site. Once it's done, it will give you a public URL that you can share with Katyayani.
