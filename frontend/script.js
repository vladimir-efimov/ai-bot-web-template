// Элементы DOM
const openChatBtn = document.getElementById('openChat');
const closeChatBtn = document.getElementById('closeChat');
const chatOverlay = document.getElementById('chatOverlay');
const chatMessages = document.getElementById('chatMessages');
const chatButtons = document.getElementById('chatButtons');

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

// Функция отправки сообщения на сервер
async function sendMessage(buttonText) {
    try {
        // Визуальное отображение отправленного сообщения
        addMessage(buttonText, 'user');

        // Отправка запроса на сервер
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: buttonText })
        });

        const data = await response.json();

        // Обработка ответа от сервера
        if (data.text) {
            addMessage(data.text, 'bot');
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
    // В реальном приложении здесь может быть инициализация соединения с сервером
});
