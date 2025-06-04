let firstInteraction = true;

// Hàm mở/đóng chatbox
function toggleChat() {
    const chatbox = document.getElementById("chatbox");
    const toggle = document.getElementById("chatToggle");

    if (chatbox.classList.contains("show")) {
        chatbox.classList.remove("show");
        toggle.style.opacity = "1";
    } else {
        chatbox.classList.add("show");
        toggle.style.opacity = "0";
    }
}

// Chức năng chọn câu hỏi gợi ý
function selectSuggestion(question) {
    document.getElementById("user-input").value = question; // Lấy câu hỏi, không phải button
    sendMessage();
    hideSuggestions();
}

function hideSuggestions() {
    const suggestions = document.getElementById("suggestions");
    suggestions.style.display = "none";
}

function checkEnter(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        sendMessage();
    }
}

async function sendMessage() {
    const input = document.getElementById("user-input");
    const message = input.value.trim();
    if (!message) return;

    if (firstInteraction) {
        hideSuggestions();
        firstInteraction = false;
    }

    appendMessage("user", message);
    input.value = "";

    const response = await fetch("http://localhost:5005/webhooks/rest/webhook", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            sender: "user",
            message: message
        })
    });

    const data = await response.json();
    if (data.length === 0) {
        typeMessage("bot", "🤔 I'm not sure I understand what you mean. \nCould you please rephrase or ask about a SuperWAL service?");
        return;
    }

    for (const msg of data) {
        if (msg.text) {
            await typeMessage("bot", marked.parse(msg.text));
        }
    }
}

function appendMessage(sender, text, isHTML = false) {
    const container = document.getElementById("messages");

    const msgWrapper = document.createElement("div");
    msgWrapper.className = "message " + sender;

    const avatar = document.createElement("div");
    avatar.className = "avatar";
    avatar.innerText = sender === "bot" ? "🤖" : "🧑";

    const bubble = document.createElement("div");
    bubble.className = "bubble";

    if (isHTML) {
        bubble.innerHTML = text;
    } else {
        bubble.innerText = text;
    }

    msgWrapper.appendChild(avatar);
    msgWrapper.appendChild(bubble);
    container.appendChild(msgWrapper);
    container.scrollTop = container.scrollHeight;
}

async function typeMessage(sender, htmlText) {
    const container = document.getElementById("messages");

    const msgWrapper = document.createElement("div");
    msgWrapper.className = "message " + sender;

    const avatar = document.createElement("div");
    avatar.className = "avatar";
    avatar.innerText = sender === "bot" ? "🤖" : "🧑";

    const bubble = document.createElement("div");
    bubble.className = "bubble";

    msgWrapper.appendChild(avatar);
    msgWrapper.appendChild(bubble);
    container.appendChild(msgWrapper);
    container.scrollTop = container.scrollHeight;

    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = htmlText;
    const fullText = tempDiv.innerText;

    for (let i = 0; i <= fullText.length; i++) {
        bubble.innerText = fullText.substring(0, i);
        container.scrollTop = container.scrollHeight;
        await new Promise(r => setTimeout(r, 15));
    }

    bubble.innerHTML = htmlText;
}

// Hàm để chọn ngẫu nhiên các suggestion
function getRandomSuggestions() {
    const suggestionsList = [
        "How scalable is SuperWAL?",
        "What is WaLSynx?",
        "What is SuperWAL's support email?",
        "Tell me about the ad reward feature",
        "How does SuperWAL plan its ecosystem?",
        "How often are policies updated?"
    ];

    // Chọn ngẫu nhiên 3 suggestion
    const randomSuggestions = [];
    while (randomSuggestions.length < 3) {
        const randomIndex = Math.floor(Math.random() * suggestionsList.length);
        const randomSuggestion = suggestionsList[randomIndex];

        // Thêm nếu chưa có trong mảng đã chọn
        if (!randomSuggestions.includes(randomSuggestion)) {
            randomSuggestions.push(randomSuggestion);
        }
    }

    return randomSuggestions;
}

// Hàm để hiển thị câu hỏi gợi ý
function displayRandomSuggestions() {
    const randomSuggestions = getRandomSuggestions();
    const suggestionsContainer = document.getElementById("suggestions");

    // Xóa các suggestion cũ
    suggestionsContainer.innerHTML = "";

    // Thêm các suggestion mới vào container
    randomSuggestions.forEach(suggestion => {
        const button = document.createElement("button");
        button.textContent = suggestion;
        button.onclick = () => selectSuggestion(suggestion); // Truyền câu hỏi vào selectSuggestion
        suggestionsContainer.appendChild(button);
    });
}

// Gọi hàm khi mở chat lần đầu tiên
document.getElementById("chatToggle").addEventListener("click", function () {
    displayRandomSuggestions();
});
