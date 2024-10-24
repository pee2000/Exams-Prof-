const chatBox = document.getElementById('chat-box');
const inputField = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');
const historyButton = document.getElementById('history-button');
const chatHistory = document.getElementById('chat-history');

sendButton.addEventListener('click', sendMessage);
inputField.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

historyButton.addEventListener('click', function () {
    chatHistory.classList.toggle('hidden');
});

function sendMessage() {
    const userMessage = inputField.value.trim();
    if (userMessage) {
        displayMessage(userMessage, 'user');
        inputField.value = '';
        getChatbotResponse(userMessage);
    }
}

function displayMessage(message, sender) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', `${sender}-message`);
    messageElement.textContent = message;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function getChatbotResponse(message) {
    Promise.all([fetchChatGPTResponse(message), fetchGoogleResponse(message)])
        .then(responses => {
            const bestAnswer = chooseBestAnswer(responses[0], responses[1]);
            displayMessage(bestAnswer, 'ai');
            saveChatHistory(message, bestAnswer);
        })
        .catch(error => {
            displayMessage('Sorry, there was an error retrieving the answer.', 'ai');
            console.error(error);
        });
}

function fetchChatGPTResponse(message) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(`Answer from AI for: "${message}"`);
        }, 1000); // Simulate delay
    });
}

function fetchGoogleResponse(message) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(`Relevant info found on Google for: "${message}"`);
        }, 1000); // Simulate delay
    });
}

function chooseBestAnswer(chatGPTResponse, googleResponse) {
    if (chatGPTResponse.length > googleResponse.length) {
        return chatGPTResponse;
    } else {
        return googleResponse;
    }
}

function saveChatHistory(userMessage, aiResponse) {
    const historyList = document.getElementById('history-list');
    const historyItem = document.createElement('li');
    historyItem.textContent = `You: ${userMessage} | Response: ${aiResponse}`;
    historyList.appendChild(historyItem);
}
