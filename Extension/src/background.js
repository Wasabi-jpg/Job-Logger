
// Step 1. Import necessary modules from AWS SDK and uuid
//    These come from the `npm install @aws-sdk/client-lex-runtime-v2 uuid` command.
import { LexRuntimeV2Client, RecognizeTextCommand } from "@aws-sdk/client-lex-runtime-v2";
import { v4 as uuidv4 } from 'uuid'; // For generating unique session IDs

// Step 2. Configure your AWS Lex Runtime V2 Client
const lexClient = new LexRuntimeV2Client({
    region: "us-east-1", 
    credentials: {
        accessKeyId: "AKIARWPFIBPNW743PTGP",    // <--- REPLACE WITH YOUR AWS ACCESS KEY ID https://116981763035.signin.aws.amazon.com/console, Job_Logger_User
        secretAccessKey: "lPc4GhEN2EgbXAYeMmtRM4e+sniPM9N5YAm9FlfA", // <--- REPLACE WITH YOUR AWS SECRET ACCESS KEY cpL60U9$
    },
});

// Step 3. Define your Lex Bot details
const BOT_ID = "8U2T8GWDG9";           // Get this from your Lex bot's "Bot details" page
const BOT_ALIAS_ID = "$LATEST"; // Usually "LIVE" or "$LATEST" (check your bot's Aliases section)
const LOCALE_ID = "en_US";                  // Matches your bot's locale

// Step 4. Manage Lex Session ID
//    For simplicity in a hackathon, we'll store it in localStorage within the Service Worker.
//    A new session ID is generated if one doesn't exist. This helps Lex maintain conversation state.
// let lexSessionId = localStorage.getItem('lexSessionId');
// if (!lexSessionId) {
//     lexSessionId = uuidv4();
//     localStorage.setItem('lexSessionId', lexSessionId);
// }
// console.log("Lex Session ID:", lexSessionId);

// Step 5. Function to send text to Lex and get a response
async function sendTextToLex(inputText) {
    console.log("Sending to Lex:", inputText);

    // Get the session ID from chrome.storage.local asynchronously
    let lexSessionId = (await chrome.storage.local.get('lexSessionId')).lexSessionId;
    if (!lexSessionId) {
        lexSessionId = uuidv4();
        await chrome.storage.local.set({lexSessionId: lexSessionId}); // Store it for future use
        console.log("Generated new Lex Session ID:", lexSessionId);
    } else {
        console.log("Using existing Lex Session ID:", lexSessionId);
    }

    const command = new RecognizeTextCommand({ // Changed to RecognizeTextCommand as discussed
        botId: BOT_ID,
        botAliasId: BOT_ALIAS_ID,
        localeId: LOCALE_ID,
        sessionId: lexSessionId, // Use the retrieved/generated session ID
        text: inputText,
    });

    try {
        const response = await lexClient.send(command);
        console.log("Lex API Response:", response);

        // ... (rest of sendTextToLex logic remains the same for processing response messages) ...

    } catch (error) {
        console.error("Error calling Lex API:", error);
        return "Oops! I'm having trouble connecting to the bot right now. Please try again later.";
    }
}

// Step 6. Listen for messages from popup.js (remains the same)
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "SEND_TO_LEX") {
        sendTextToLex(request.message)
            .then(lexResponseContent => {
                sendResponse({ status: "success", response: lexResponseContent });
            })
            .catch(error => {
                sendResponse({ status: "error", message: error.message || "Unknown error from Lex API." });
            });
        return true; 
    }
});