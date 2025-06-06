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

    // const data = await response.json();
    // if (data.length === 0) {
    //     typeMessage("bot", "🤔 I'm not sure I understand what you mean. \nCould you please rephrase or ask about a SuperWAL service?");
    //     return;
    // }

    const data = await response.json();

    if (data.length === 0) {
        // 1. Danh sách các câu trả lời ngẫu nhiên khi bot không hiểu
        const fallbackMessages = [
            "🤔 I'm not sure I understand what you mean. Could you please rephrase or ask about a **SuperWAL service**?",
            "Oops! My circuits are a little confused. Could you try asking that in a different way, perhaps about **SuperWAL**?",
            "My apologies! I'm still learning. Could you clarify what you mean, or ask about our **SuperWAL services**?",
            "Pardon me, I didn't quite catch that! Would you mind rephrasing or asking about a **SuperWAL feature**?",
            "🚫 Sorry, that doesn’t seem related to anything I can help with. \nTry asking about services like **WaLPay**, **WaLTrust**, or **WaLID**!",
            "🤖 That input isn’t recognized. But I’m here to help with all things SuperWAL — let’s try again!"
        ];

        // 2. Danh sách các gợi ý về dịch vụ/câu hỏi khác (có in đậm bằng Markdown)
        const serviceSuggestions = [
            "**WaLSynx**,",
            "how **SuperWAL** plans its **ecosystem**,",
            "the **ad reward feature**,",
            "or perhaps **SuperWAL's support email**."
        ];

        // Chọn ngẫu nhiên một câu trả lời gốc
        const randomFallbackMessage = fallbackMessages[Math.floor(Math.random() * fallbackMessages.length)];

        // Chọn ngẫu nhiên 2 hoặc 3 gợi ý dịch vụ
        const selectedServiceSuggestions = [];
        const numSuggestionsToShow = Math.floor(Math.random() * 2) + 2; // Chọn 2 hoặc 3
        const tempServiceSuggestions = [...serviceSuggestions]; 

        while (selectedServiceSuggestions.length < numSuggestionsToShow && tempServiceSuggestions.length > 0) {
            const randomIndex = Math.floor(Math.random() * tempServiceSuggestions.length);
            selectedServiceSuggestions.push(tempServiceSuggestions.splice(randomIndex, 1)[0]);
        }

        // 3. Kết hợp tin nhắn gốc và các gợi ý
        let combinedMessageText = randomFallbackMessage; // Đặt tên khác để dễ phân biệt
        if (selectedServiceSuggestions.length > 0) {
            combinedMessageText += "\n\nPerhaps you could ask about: " + selectedServiceSuggestions.join(" ") + "";
        }
        

        const finalHtmlMessage = marked.parse(combinedMessageText);


        await typeMessage("bot", finalHtmlMessage); // Truyền HTML đã parse
        return;
    }

    let botResponseText = "";
    for (const msg of data) {
        if (msg.text) {
            botResponseText += msg.text + "\n";
        }
    }
    botResponseText = botResponseText.trim();

    // Parse Markdown TẠI ĐÂY cho phản hồi từ Rasa
    if (botResponseText) {
        const finalRasaHtmlMessage = marked.parse(botResponseText); // Parse ở đây
        await typeMessage("bot", finalRasaHtmlMessage); // Truyền HTML đã parse
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
    tempDiv.innerHTML = htmlText; // Gán HTML vào một div tạm thời
    const fullPlainText = tempDiv.innerText; // Lấy toàn bộ văn bản thuần túy từ HTML đó

    for (let i = 0; i <= fullPlainText.length; i++) {
        // Tạo một div tạm thời khác để chuyển đổi phần văn bản thuần túy đã gõ thành HTML
        const partDiv = document.createElement("div");
        partDiv.innerText = fullPlainText.substring(0, i); // Gán văn bản thuần túy đã gõ
        
        // Sau đó, chuyển đổi phần văn bản đó sang Markdown nếu nó có chứa Markdown
        // (Đây là cách đơn giản để đảm bảo các dấu ** vẫn hoạt động)
        bubble.innerHTML = marked.parse(partDiv.innerText); // Chuyển đổi và gán vào bubble
        
        container.scrollTop = container.scrollHeight;
        await new Promise(r => setTimeout(r, 15));
    }

    // Đảm bảo nội dung cuối cùng là HTML đã được parse hoàn chỉnh
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
