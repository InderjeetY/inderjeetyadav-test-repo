/* =========== CHAT MODAL LOGIC =========== */

// Global variables to manage conversation state
let conversationStep = 0;
let userData = {
    name: '',
    jobTitle: '',
    email: '',
    phone: '',
    jd: ''
};

// --- Get all the elements we need ---
const downloadBtn = document.getElementById('downloadBtn');
const modalOverlay = document.getElementById('chatModalOverlay');
const closeBtn = document.querySelector('.chat-modal-close');
const sendBtn = document.getElementById('chatSendBtn');
const chatMessages = document.getElementById('chatMessages');
const chatTextarea = document.getElementById('chatTextarea');
const chatInputArea = document.getElementById('chatInputArea');
const chatError = document.getElementById('chatError'); // Get the new error div

// --- Helper function to add a message to the chat window ---
function addMessage(sender, text) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('chat-message', sender);
    messageDiv.innerHTML = text; // Use innerHTML to render the link
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// --- Helper function to validate input ---
function validateInput(text, step) {
    const emailRegex = /\S+@\S+\.\S+/;
    const phoneRegex = /[\d\s()+-]{7,}/;

    switch (step) {
        case 0: return text.length >= 2; // Name
        case 1: return text.length >= 2; // Job Title
        case 2: return emailRegex.test(text); // Email
        case 3: return phoneRegex.test(text); // Phone
        case 4: return text.length >= 10; // Job Description
        default: return false;
    }
}

// --- NEW: Helper function to show errors ---
function showError() {
    chatError.style.display = 'block'; // Show the error container
    switch (conversationStep) {
        case 0:
            chatError.textContent = 'Please enter a valid name (at least 2 characters).';
            break;
        case 1:
            chatError.textContent = 'Please enter a valid job title (at least 2 characters).';
            break;
        case 2:
            chatError.textContent = 'Please enter a valid email address.';
            break;
        case 3:
            chatError.textContent = 'Please enter a valid phone number (at least 7 digits).';
            break;
        case 4:
            chatError.textContent = 'Please enter a job description (at least 10 characters).';
            break;
    }
}

// --- Helper function to advance the conversation ---
function nextStep(userText) {
    // Add the user's reply to the chat
    addMessage('user', userText);

    switch (conversationStep) {
        case 0: // User just sent their Name
            userData.name = userText;
            addMessage('bot', `Nice to meet you, ${userText}. What is your job title?`);
            chatTextarea.placeholder = "Your job title...";
            break;
        case 1: // User just sent their Job Title
            userData.jobTitle = userText;
            addMessage('bot', `Great. What's your email address?`);
            chatTextarea.placeholder = "Your email...";
            break;
        case 2: // User just sent their Email
            userData.email = userText;
            addMessage('bot', 'And a phone number?');
            chatTextarea.placeholder = "Your phone number...";
            break;
        case 3: // User just sent their Phone
            userData.phone = userText;
            addMessage('bot', 'Perfect. Now, please paste the job description or a link to it.');
            chatTextarea.placeholder = "Paste the job description...";
            break;
        case 4: // User just sent the Job Description
            userData.jd = userText;
            chatTextarea.placeholder = "Thank you! Sending...";
            
            // Disable the input area
            chatTextarea.disabled = true;
            sendBtn.disabled = true;
            chatInputArea.style.opacity = '0.6';

            // Send the email with all the collected data
            sendEmail(userData.name, userData.jobTitle, userData.email, userData.phone, userData.jd);

            // Add bot's "thinking" message
            setTimeout(() => {
                addMessage('bot', '...');
            }, 800);

            // Add bot's final response with BOTH links
            setTimeout(() => {
                addMessage('bot', 
                    'Thank you! That\'s very helpful. Here is your download link:' +
                    '<br><br> <a href="InderjeetYadav.pdf" class="download-btn" download style="font-size: 0.9rem;"> <i class="fas fa-download"></i> Download Resume Now</a>' +
                    '<br><br> P.S. Want to skip the email tag? You can book a 15-minute chat directly on my calendar:' +
                    '<br><br> <a href="https://calendly.com/inderjeet_yadav" target="_blank" class="download-btn" style="background-color: #0d6efd; font-size: 0.9rem;"> <i class="fas fa-calendar-alt"></i> Book a Meeting</a>'
                );
            }, 2000);
            break;
    }

    // Move to the next step
    conversationStep++;
}

// --- Show the modal when the Download button is clicked ---
downloadBtn.addEventListener('click', function(event) {
    event.preventDefault(); // PREVENT the default download
    modalOverlay.style.display = 'block';

    // Ensure button is disabled on open if input is empty
    sendBtn.disabled = (chatTextarea.value.trim() === '');

    // Start the conversation if it's the first time
    if (chatMessages.children.length === 0) {
        setTimeout(() => {
            addMessage('bot', 'Hello! Thanks for your interest. Before you download, I just need to get a few details. What is your full name?');
            chatTextarea.placeholder = "Your full name...";
        }, 500); // Small delay
    }
});

// --- Close the modal ---
function closeModal() {
    modalOverlay.style.display = 'none';
}
closeBtn.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', function(event) {
    // Close only if clicking on the background overlay
    if (event.target === modalOverlay) {
        closeModal();
    }
});

// --- Handle sending the message (MODIFIED) ---
sendBtn.addEventListener('click', function() {
    const userText = chatTextarea.value.trim();

    // validateInput already checks for empty string, but this is a good safeguard.
    if (validateInput(userText, conversationStep)) {
        // Validation passed
        nextStep(userText);
        chatTextarea.value = ""; // Clear the input
        sendBtn.disabled = true; // Disable button after successful send
    } else {
        // Validation failed, show an error
        showError();
    }
});

// --- NEW: Add event listener for typing ---
chatTextarea.addEventListener('input', function() {
    // Clear error as soon as user types
    chatError.textContent = '';
    chatError.style.display = 'none';

    // Enable/disable send button
    if (chatTextarea.value.trim() === '') {
        sendBtn.disabled = true;
    } else {
        sendBtn.disabled = false;
    }
});


// --- Also allow sending with the "Enter" key ---
chatTextarea.addEventListener('keydown', function(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault(); // Stop "Enter" from adding a new line
        
        // Only click if button is not disabled
        if (!sendBtn.disabled) {
            sendBtn.click();
        }
    }
});
