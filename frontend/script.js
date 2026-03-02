
const BASE_URL = 'http://localhost:8080'; // URL Spring Boot приложения

// Элементы DOM
const openChatBtn = document.getElementById('openChat');
const closeChatBtn = document.getElementById('closeChat');
const chatOverlay = document.getElementById('chatOverlay');
const chatMessages = document.getElementById('chatMessages');
const chatButtons = document.getElementById('chatButtons');

// Открываем чат
openChatBtn.addEventListener('click', () => {
    chatOverlay.style.display = 'block';
    // Отправляем стартовое сообщение при первом открытии диалога
    let isStarted = sessionStorage.getItem('started');
    if (!isStarted) {
        sendMessage('start');
        sessionStorage.setItem('started', 'true');
    }
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
            sessionStorage.setItem('chatId', data.chatId);
        }
        sessionStorage.setItem('started', '');
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
        let chatId = sessionStorage.getItem('chatId');
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
    const safeText = escapeHtml(text);
    const formattedText = markdown2Html(safeText);
    messageDiv.innerHTML = formattedText;
    chatMessages.appendChild(messageDiv);
    // Прокрутка к последнему сообщению
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function markdown2Html(markdown) {
  // Конвертируем ссылки и '\n'
  // Паттерн ищет [текст](ссылка) и заменяет на <a href="ссылка">текст</a>
  return markdown
    .replace(/\n/g, '<br>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
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
