import axios from "axios";
import { showAlert } from "./alerts";
import { createMessageElement } from "./messageBlock";

const chatBox = document.querySelector(".chatBox__top");

export const keepChatBoxScrolledDown = () =>
  (chatBox.scrollTop = chatBox.scrollHeight);

export const getConversations = (conversations, input) => {
  conversations.forEach((item) => {
    const conversationId = item.dataset.conversationId;
    item.addEventListener("click", async (e) => {
      input.dataset.conversationId = conversationId;
      conversations.forEach((con) => con.classList.remove("selected"));
      item.classList.add("selected");
      const res = await axios({
        method: "GET",
        url: `http://127.0.0.1:8080/api/messages/${conversationId}`,
      });
      const data = res.data.data.messages;
      const userId = res.data.data.userId;
      const messages = data.map((msg) => createMessageElement(msg, userId));
      chatBox.innerHTML = "";
      messages.forEach((msg) => chatBox.appendChild(msg));
      keepChatBoxScrolledDown();
    });
  });
};

export const submitNewMessage = (input, button) => {
  button.addEventListener("click", async (e) => {
    const conversationId = input.dataset.conversationId;
    const sender = input.dataset.userId;
    const text = input.value.trim();
    input.value = "";
    input.focus();
    e.target.classList.add("disabled");
    try {
      const res = await axios({
        method: "POST",
        url: "http://127.0.0.1:8080/api/messages",
        data: {
          conversationId,
          sender,
          text,
        },
      });

      if (res.data.status === "success") {
        e.target.classList.remove("disabled");
        const newMessage = createMessageElement(res.data.data.message, sender);
        chatBox.appendChild(newMessage);
        keepChatBoxScrolledDown();
      }
    } catch (err) {
      e.target.classList.remove("disabled");
      showAlert("error", "Fail");
    }
  });
};

if(chatBox) keepChatBoxScrolledDown();


