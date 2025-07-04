# Noor AI Chatbot

This is a Next.js project for a personal AI chatbot named Noor.

## Deploying to Netlify (Recommended)

Netlify is a platform that makes it very easy to deploy modern web applications like this one for free. The following steps will guide you through deploying this project from Firebase Studio to a live, public URL that you can share with Katyayani.

### Step 1: Get your Google AI API Key

Your chatbot uses Google's Generative AI (Gemini). To use it on Netlify, you need to provide an API key.

1.  Go to **[Google AI Studio](https://aistudio.google.com/)**.
2.  Click on "**Get API key**" and create a new key in your Google Cloud project.
3.  Copy this key. You will need it in Step 4.

### Step 2: Download and Unzip Your Project

To move your code to GitHub and Netlify, you first need to download it from this Firebase Studio environment.

1.  **Find the Download Button:** In the top bar of the Firebase Studio interface (the web page you are currently using), you will see a **"Download code"** button. This is a feature of this specific editor.
2.  **Download the ZIP File:** Click this button. Your browser will download a single `.zip` file containing your entire project (e.g., `noor-ai-chatbot.zip`). This file will likely be in your computer's "Downloads" folder.
3.  **Unzip the Project:** Find the downloaded `.zip` file on your computer and extract its contents.
    *   On **Windows**, right-click the file and choose "Extract All...".
    *   On a **Mac**, simply double-click the file.
4.  This will create a new folder with all of your project files inside. This folder is what you will use in Step 3.

### Step 3: Push to GitHub

Netlify deploys directly from a Git repository.

1.  Go to **[GitHub](https://github.com)** and create a new, empty repository. Do **not** initialize it with a README or license file.
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

### Step 4: Deploy on Netlify

1.  Sign up for a free **[Netlify](https://www.netlify.com/)** account (it's easiest to sign up with your GitHub account).
2.  On your Netlify dashboard, click "**Add new site**" and select "**Import an existing project**".
3.  Connect to GitHub and authorize Netlify. Select the GitHub repository you just created.
4.  Netlify will automatically detect that this is a Next.js project. You need to ensure the build settings are correct.
    *   **Build command:** `next build`
    *   **Publish directory:** `.next`
    
    **IMPORTANT:** The publish directory **must** be `.next`. Do NOT use `out`. Your application is dynamic and uses server-side features to talk to the AI. Using `out` would attempt a static export, which is not compatible with your app and will cause the build to fail. The `netlify.toml` file in your repository is already configured with these correct settings, but it's good to verify them in the Netlify UI.

5.  Before deploying, go to the "**Advanced build settings**" or "**Environment variables**" section.
6.  Add a new variable:
    *   **Key:** `GOOGLE_API_KEY`
    *   **Value:** Paste the API key you copied from Google AI Studio in Step 1.
7.  Click "**Deploy site**".

Netlify will now build and deploy your chatbot. Once it's finished, it will give you a public URL (like `your-project-name.netlify.app`).

### Step 5: Whitelist Your Netlify Domain in Firebase

This is a **critical security step** to ensure Firebase allows your live app to connect to your Firestore database.

1.  Copy the public URL Netlify gave you.
2.  Go to your **[Firebase Console](https://console.firebase.google.com/)** and select your project (`noorchat-3a26e`).
3.  In the left-hand menu, go to **Authentication** -> **Settings** tab.
4.  Under the **Authorized domains** section, click "**Add domain**".
5.  Paste your Netlify URL (e.g., `noorchat-3a26e.netlify.app`) and click "Add".

Your chatbot is now live, secure, and ready to be shared with Katyayani!

### Security: Making Your Repository Public

It is safe to make your GitHub repository for this project public. The most important secret, your `GOOGLE_API_KEY`, is protected in two ways:

*   **Netlify Environment Variables**: For your live website, the API key is stored securely in your Netlify project settings. It is never included in the code that is visible on GitHub.
*   **`.gitignore` File**: This project includes a `.gitignore` file. This special file tells Git to ignore certain files and folders, most importantly the `.env` file where you might store your API key for local testing. This prevents you from ever accidentally committing your secrets to GitHub.

As long as you never write your API key directly into any file that isn't in `.gitignore`, your repository is safe to be public.

### Common Mistakes to Avoid
*   **Forgetting Environment Variables**: If you forget to add the `GOOGLE_API_KEY` in Netlify, the AI will not work.
*   **Wrong Publish Directory**: Make sure the publish directory is set to `.next`. If it's set to something else (like `out` or `build`), the deployment will fail.
*   **Not Whitelisting the Domain**: If you don't add your Netlify URL to the Firebase "Authorized domains", Firestore will block requests from your live app, and the chat history won't load or save.
