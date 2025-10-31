/* =========== CHAT MODAL LOGIC =========== */

// Get all the elements we need
const downloadBtn = document.getElementById('downloadBtn');
const modalOverlay = document.getElementById('chatModalOverlay');
const closeBtn = document.querySelector('.chat-modal-close');
const sendBtn = document.getElementById('chatSendBtn');
const chatMessages = document.getElementById('chatMessages');
const chatTextarea = document.getElementById('chatTextarea');
const chatInputArea = document.getElementById('chatInputArea');

// --- Function to add a message to the chat window ---
function addMessage(sender, text) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('chat-message', sender);
    messageDiv.innerHTML = text; // Use innerHTML to render the link
    chatMessages.appendChild(messageDiv);

    // Scroll to the bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// --- Show the modal when the Download button is clicked ---
downloadBtn.addEventListener('click', function(event) {
    // PREVENT the default download
    event.preventDefault();

    // Show the modal
    modalOverlay.style.display = 'block';

    // Add the bot's first message (if it's not already there)
    if (chatMessages.children.length === 0) {
        setTimeout(() => {
            addMessage('bot', 'Hello! Thanks for your interest. Before you download, could you please paste the job description you are hiring for?');
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

// --- Handle sending the message ---
sendBtn.addEventListener('click', function() {
    const userText = chatTextarea.value.trim();

    if (userText !== "") {
        // 1. Add the user's message
        // To be safe, we'll display the user's text as plain text
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('chat-message', 'user');
        messageDiv.textContent = userText;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight; // Scroll after adding

        // 2. Clear the input
        chatTextarea.value = "";

        // 3. Disable the input area
        chatTextarea.disabled = true;
        sendBtn.disabled = true;
        chatInputArea.style.opacity = '0.6';

        // 4. Add bot's "thinking" message
        setTimeout(() => {
            addMessage('bot', '...');
        }, 800);

        // 5. Add bot's final response with the download link
        setTimeout(() => {
            // We use innerHTML here to make the link clickable
            addMessage('bot', 'Thank you! That\'s very helpful. Here is the download link: <br><br> <a href="InderjeetYadav.pdf" class="download-btn" download style="font-size: 0.9rem;"> <i class="fas fa-download"></i> Download Resume Now</a>');
        }, 2000); // 2-second delay
    }
});
