
const BASE_URL = 'http://localhost:8080'; // URL Spring Boot приложения

// Элементы DOM
const openChatBtn = document.getElementById('openChat');
const closeChatBtn = document.getElementById('closeChat');
const chatOverlay = document.getElementById('chatOverlay');
const chatMessages = document.getElementById('chatMessages');
const chatButtons = document.getElementById('chatButtons');

let chatId = 0;
// TODO: check use of localStorage.setItem('chatId', chatId);

// Открываем чат
openChatBtn.addEventListener('click', () => {
    chatOverlay.style.display = 'block';
    // Отправляем стартовое сообщение
    sendMessage('start');
});

// Закрываем чат
closeChatBtn.addEventListener('click', () => {
    chatOverlay.style.display = 'none';
});

async function initChat() {
    try {
        // Отправка запроса на сервер
        const response = await fetch(BASE_URL + '/api/chats', {
            method: 'POST',
        });

        const data = await response.json();
        if (data.chatId) {
            chatId = data.chatId;
        }
    } catch (error) {
        console.error('Ошибка при отправке сообщения:', error);
        addMessage('Произошла ошибка при подключении к серверу', 'bot');
    }
}


// Функция отправки сообщения на сервер
async function sendMessage(buttonText) {
    try {
        addMessage(buttonText, 'user');

        // Отправка запроса на сервер
        const response = await fetch(BASE_URL + '/api/chats/' + chatId, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ buttonName: buttonText })
        });

        const data = await response.json();

        // Обработка ответа от сервера
        if (data.message) {
            addMessage(data.message, 'bot');
        }
        if (data.buttons) {
            renderButtons(data.buttons);
        }
    } catch (error) {
        console.error('Ошибка при отправке сообщения:', error);
        addMessage('Произошла ошибка при подключении к серверу', 'bot');
    }
}

// Добавление сообщения в чат
function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    messageDiv.textContent = text;
    chatMessages.appendChild(messageDiv);
    // Прокрутка к последнему сообщению
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Отрисовка кнопок
function renderButtons(buttons) {
    // Очищаем предыдущие кнопки
    chatButtons.innerHTML = '';

    buttons.forEach(buttonText => {
        const button = document.createElement('button');
        button.className = 'chat-button';
        button.textContent = buttonText;
        button.addEventListener('click', () => sendMessage(buttonText));
        chatButtons.appendChild(button);
    });
}

// Инициализация: при открытии чата отправляем стартовое сообщение
document.addEventListener('DOMContentLoaded', () => {
    initChat();
});
