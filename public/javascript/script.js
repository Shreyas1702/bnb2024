const chatbotToggler = document.querySelector(".chatbot-toggler");
const closeBtn = document.querySelector(".close-btn");
const chatbox = document.querySelector(".chatbox");
const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");
let serviceSel = null;
let userMessage = null; // Variable to store user's message
const inputInitHeight = chatInput.scrollHeight;
let selectedEquipments = {}; // Object to store selected equipments and their amounts
let chatState = "start"; // Initial state
let option = null;
let amount = 0;
//const micIcon = document.getElementById("mic-icon");
//const sendBtn = document.getElementById("send-btn");

const createChatLi = (message, className) => {
  // Create a chat <li> element with passed message and className
  const chatLi = document.createElement("li");
  chatLi.classList.add("chat", `${className}`);
  let chatContent =
    className === "outgoing"
      ? `<p></p>`
      : `<span class="material-symbols-outlined">smart_toy</span><p></p>`;
  chatLi.innerHTML = chatContent;
  chatLi.querySelector("p").textContent = message;
  return chatLi; // return chat <li> element
};

const appendMessage = (message, className) => {
  const chatLi = createChatLi(message, className);
  chatbox.appendChild(chatLi);
  chatbox.scrollTo(0, chatbox.scrollHeight);
};

const handleChat = () => {
  userMessage = chatInput.value.trim(); // Get user entered message and remove extra whitespace
  if (!userMessage) return;

  switch (chatState) {
    case "start":
      // Check if the user selected option 1 for equipment service
      if (userMessage === "1") {
        // Display the response for selecting equipment service
        const responseMessage =
          "You have chosen equipment registration. Please select the equipment: A - Tractor, B - Plow, C - Seeder, D - Harvester, E - Fertilizer Sprayer, F - Hoe, G - Sprayer, H - Tiller";
        serviceSel = "EquipmentReg";
        appendMessage(userMessage, "outgoing");
        setTimeout(() => {
          chatbox.scrollTo(0, chatbox.scrollHeight);
          appendMessage(responseMessage, "incoming");
        }, 300);

        chatState = "equipmentSelection"; // Update state
      }
      if (userMessage === "2") {
        // Display the response for selecting equipment service
        serviceSel = "SeedReg";
        const responseMessage =
          "You have chosen seed registration. Please select the equipment: A - Wheat, B - Corn, C - Rice, D - Potato, E - Tomato";
        appendMessage(userMessage, "outgoing");
        setTimeout(() => {
          chatbox.scrollTo(0, chatbox.scrollHeight);
          appendMessage(responseMessage, "incoming");
        }, 300);

        chatState = "equipmentSelection"; // Update state
      }
      break;
    case "equipmentSelection":
      // If user selects equipment A or B
      if (serviceSel === "EquipmentReg") {
        const equipmentOptions = {
          A: "Tractor",
          B: "Plow",
          C: "Seeder",
          D: "Harvester",
          E: "Fertilizer Sprayer",
          F: "Hoe",
          G: "Sprayer",
          H: "Tiller",
        };

        if (Object.keys(equipmentOptions).includes(userMessage)) {
          // If user selects equipment, prompt for the amount
          const selectedEquipment = equipmentOptions[userMessage];
          const responseMessage = `You have chosen ${selectedEquipment}. Please enter the amount:`;
          appendMessage(userMessage, "outgoing");
          setTimeout(() => {
            chatbox.scrollTo(0, chatbox.scrollHeight);
            appendMessage(responseMessage, "incoming");
          }, 300);
          chatState = "amountEntry"; // Update state
          option = selectedEquipment;
        } else {
          // If user enters invalid input in the equipment selection state
          setTimeout(() => {
            chatbox.scrollTo(0, chatbox.scrollHeight);
            appendMessage(
              "Invalid input. Please enter a valid option.",
              "incoming"
            );
          }, 300);
        }
      } else if (serviceSel === "SeedReg") {
        const seedOptions = {
          A: "Wheat",
          B: "Corn",
          C: "Rice",
          D: "Potato",
          E: "Tomato",
        };

        if (Object.keys(seedOptions).includes(userMessage)) {
          // If user selects seed, prompt for the amount
          const selectedSeed = seedOptions[userMessage];
          const responseMessage = `You have chosen ${selectedSeed}. Please enter the amount:`;
          appendMessage(userMessage, "outgoing");
          setTimeout(() => {
            chatbox.scrollTo(0, chatbox.scrollHeight);
            appendMessage(responseMessage, "incoming");
          }, 300);
          chatState = "amountEntry"; // Update state
          option = selectedSeed;
        } else {
          // If user enters invalid input in the seed selection state
          setTimeout(() => {
            chatbox.scrollTo(0, chatbox.scrollHeight);
            appendMessage(
              "Invalid input. Please enter a valid option.",
              "incoming"
            );
          }, 300);
        }
      }
      break;
    case "amountEntry":
      amount = parseInt(userMessage);
      if (isNaN(amount)) {
        setTimeout(() => {
          chatbox.scrollTo(0, chatbox.scrollHeight);
          appendMessage(
            "Invalid input. Please enter a number for the amount.",
            "incoming"
          );
        }, 300);
      } else {
        // Notify the user about the selected equipment and amount
        appendMessage(userMessage, "outgoing");
        const responseMessage = `You have ${amount} ${option}.`;
        setTimeout(() => {
          chatbox.scrollTo(0, chatbox.scrollHeight);
          appendMessage(responseMessage, "incoming");
        }, 300);

        const nextMessage =
          "Please select the type of registration: 1 - Equipment Registration, 2 - Seed Registration";
        setTimeout(() => {
          chatbox.scrollTo(0, chatbox.scrollHeight);
          appendMessage(nextMessage, "incoming");
        }, 600);

        console.log("Amount:", amount);
        console.log("Option:", option);
        if (
          option == "Rice" ||
          option == "Wheat" ||
          option == "Tomato" ||
          option == "Potato" ||
          option == "Corn"
        ) {
          const datas = axios.post(`http://localhost:3000/changes/${option}`, {
            data: amount,
          });
        } else {
          const datas = axios.post(`http://localhost:3000/change/${option}`, {
            data: amount,
          });
        }
        chatState = "start"; // Reset state to start for next interaction
      }
      break;
    default:
      // Invalid state
      console.error("Invalid chat state");
  }

  // Clear the input textarea and set its height to default
  chatInput.value = "";
  chatInput.style.height = `${inputInitHeight}px`;
};

chatInput.addEventListener("input", () => {
  // Adjust the height of the input textarea based on its content
  chatInput.style.height = `${inputInitHeight}px`;
  chatInput.style.height = `${chatInput.scrollHeight}px`;
});

chatInput.addEventListener("keydown", (e) => {
  // If Enter key is pressed without Shift key and the window
  // width is greater than 800px, handle the chat
  if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
    e.preventDefault();
    handleChat();
  }
});

sendChatBtn.addEventListener("click", handleChat);
closeBtn.addEventListener("click", () =>
  document.body.classList.remove("show-chatbot")
);
chatbotToggler.addEventListener("click", () =>
  document.body.classList.toggle("show-chatbot")
);
