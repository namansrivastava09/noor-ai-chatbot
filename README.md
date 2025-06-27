# Updating Your Live Noor AI Chatbot

This guide provides the step-by-step process for making changes to your chatbot in Firebase Studio and deploying those updates to your live Netlify site.

## How the Workflow Works

Your code lives in three places:
1.  **Firebase Studio:** Where you are editing the code now.
2.  **Your Local Computer:** A middle-ground where you use `git` to send updates to GitHub.
3.  **GitHub:** The "master copy" of your code that Netlify watches for changes.

The process is: **Firebase Studio -> Your Computer -> GitHub -> Netlify (Live Site)**

---

### Step 1: Download Your Updated Code

After you've made changes here in Firebase Studio, you need to get the code onto your computer.

1.  **Find the Download Button:** In the top bar of the Firebase Studio interface (the web page you are currently using), you will see a **"Download code"** button.
2.  **Download the ZIP File:** Click this button. Your browser will download a `.zip` file containing your entire updated project.
3.  **Unzip the Project:** Find the downloaded `.zip` file on your computer and extract its contents. This will create a new folder with all of your updated project files.

### Step 2: Update Your Local GitHub Repository

Now, you need to copy these new files into the project folder on your computer that is linked to GitHub.

1.  **Open Both Folders:** Have two folders open on your screen:
    *   The new folder you just unzipped.
    *   Your original `noor-ai-chatbot` project folder (the one that is a `git` repository).
2.  **Copy and Replace:** Select all files and folders inside the **newly unzipped folder**, copy them, and then paste them directly into your **original `noor-ai-chatbot` folder**. Your computer will ask if you want to replace the existing files. **Choose "Replace All"**. This updates your local project with the changes you made in Firebase Studio.

### Step 3: Push the Changes to GitHub

This is where you tell GitHub about the updates using a few simple `git` commands.

1.  **Open a Terminal:** Open a terminal or command prompt and navigate into your local `noor-ai-chatbot` project folder.
    ```bash
    cd path/to/your/noor-ai-chatbot
    ```
2.  **Run Git Commands:** Run the following commands one by one.
    ```bash
    # Stage all the changes (new, modified, and deleted files)
    git add .

    # Commit the changes with a descriptive message
    git commit -m "Updated the chatbot with new features"

    # Push the commit to your main branch on GitHub
    git push origin main
    ```

### Step 4: Automatic Deployment on Netlify

This is the easiest step!

Because you connected your GitHub repository to Netlify, Netlify automatically detects the `push` you just made. It will immediately start a new build and deploy your updated site. You don't have to do anything. You can watch the progress in your Netlify dashboard. Within a few minutes, your changes will be live.

---

## Security: Protecting Your API Keys

It is **EXTREMELY IMPORTANT** that your `GOOGLE_API_KEY` is not visible in your public GitHub repository.

*   **Use Netlify Environment Variables:** Your API key should **only** be stored as an environment variable in your Netlify project settings. You have likely already done this during the initial setup.
*   **Use `.gitignore`:** I have added a `.gitignore` file to your project. This is a special file that tells `git` to **ignore** certain files and folders. It will prevent you from accidentally uploading your `.env` file (which might contain secrets) or large folders like `node_modules` to GitHub.

By following this process, you can safely and easily update your live chatbot anytime.
