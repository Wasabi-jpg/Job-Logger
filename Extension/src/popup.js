document.addEventListener('DOMContentLoaded', () => {
    const chat_message_space = document.getElementById('chat-messages');
    const chat_input = document.getElementById('user-input'); // Adjusted for your HTML ID
    const send_button = document.getElementById('send');       // Adjusted for your HTML ID

    // console.log(chat_message_space, chat_input, send_button); // Debugging log to check if elements are found

    // Adding msg to chat-messages div (chat display)
    function addMessage(messageText, sender) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message');
        if (sender === 'user') {
            messageElement.classList.add('user-message');
        } else {
            messageElement.classList.add('bot-message');
        }
        messageElement.textContent = messageText;
        chat_message_space.appendChild(messageElement);

        // Scroll to the bottom of the chat div
        chat_message_space.scrollTop = chat_message_space.scrollHeight;
    }

    // Simulate initial bot greeting
    addMessage("Hello! I'm your Job Logger Bot. How can I help you log a job application today?", "bot");

    //  handle sending a message to bot
    function sendMessage() {
        const messageText = chat_input.value.trim(); // Get input text and remove whitespace

        if (messageText !== '') { // Only send if not empty
            addMessage(messageText, 'user'); // Display user's message

            chat_input.value = ''; // Clear the input field

           chrome.runtime.sendMessage({ type: "SEND_TO_LEX", message: messageText }, (response) => {
            // This callback function receives the response from background.js

            // Always check chrome.runtime.lastError for communication issues
            if (chrome.runtime.lastError) {
                console.error("Error communicating with Service Worker:", chrome.runtime.lastError.message);
                addMessage("Extension error: Could not communicate with background service.", "bot");
                return;
            }

            // Display the response from the Service Worker (which came from Lex)
            if (response.status === "success") {
                addMessage(response.response, 'bot'); // Display Lex's actual response
            } else {
                addMessage(`Error: ${response.message}`, 'bot');
            }
        });
        }
    }

    // Basic dummy bot response generator REPLACE
    function generateDummyBotResponse(userInput) {
        const lowerCaseInput = userInput.toLowerCase();
        if (lowerCaseInput.includes('log job') || lowerCaseInput.includes('add application')) {
            return "Okay, I can help with that! What's the company name?";
        } else if (lowerCaseInput.includes('company')) {
            return "Got it. And what's the job title?";
        } else if (lowerCaseInput.includes('title')) {
            return "Thanks. Is this a full-time role? (yes/no)";
        } else if (lowerCaseInput.includes('yes') || lowerCaseInput.includes('no')) {
            return "Great! I've noted that. This is where I'd normally save it to your sheet. Let's try another one?";
        }else if (lowerCaseInput.includes('help')) {
            return "Sure! You can say 'log job' to start logging a new job application or 'add application' to add an existing one.";
        
        }else {
            return "Hmm, I'm not sure about that. Try saying 'log job' or 'add application'.";
        }
    }

    // Event listener for the Send button click
    send_button.addEventListener('click', sendMessage);

    // Event listener for pressing Enter key in the input field
    chat_input.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault(); // Prevent default Enter key behavior (like new line in textarea)
            sendMessage();
        }
    });
});