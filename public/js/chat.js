import axios from "axios";
const socket = io();
import { showAlert } from "./alerts";
import { createMessageElement } from "./messageBlock";

const chatBox = document.querySelector(".chatBox__top");
const inputField = document.querySelector(".chatBox__bottom .chatMessage__Input");

let userId = undefined



if (inputField) {
  userId = inputField.dataset.userId;

  //* Sending userId to websocket
  socket.emit("addUser", userId);
}

//* Socket.io
socket.on("message", (msg) => {
  console.log(msg);
});

//* Get all Users
socket.on("getUsers", (users) => {
  console.log(users)
});

//* Receive sent messages
socket.on("sendBackMessage", (msg) => {
  console.log(msg)
  const newMessage = createMessageElement(msg, userId);
  chatBox.appendChild(newMessage);
  autoScroll();
});
  


export const autoScroll = () => {
  chatBox.scrollTop = chatBox.scrollHeight;
  // // New message element 
  // const newMessageEl = chatBox.lastElementChild
  
  // // Heigh of the new message 
  // const newMessageStyles = getComputedStyle(newMessageEl)
  // const newMessageMargin = parseInt(newMessageStyles.marginBottom)
  // const newMessageHeight = newMessageEl.offsetHeight + newMessageMargin;

  // // Visible height 
  // const visibleHeight = chatBox.offsetHeight 

  // // Height of messages container 
  // const containerHeight = chatBox.scrollHeight; 

  // // How far has scrolled
  // const scrollOffset = chatBox.scrollTop + visibleHeight;

  // if (containerHeight - newMessageHeight <= scrollOffset) {
  //   chatBox.scrollTop = chatBox.scrollHeight
  // }
}

export const getConversations = (conversations, input) => {
  conversations.forEach((item) => {
    const conversationId = item.dataset.conversationId;
    const receiverId = item.dataset.receiverId;
    item.addEventListener("click", async (e) => {
      input.dataset.conversationId = conversationId;
      input.dataset.receiverId = receiverId;

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
      autoScroll();
    });
  });
};

export const submitNewMessage = (input, button) => {
  button.addEventListener("click", async (e) => {
    const conversationId = input.dataset.conversationId;
    const receiverId = input.dataset.receiverId;

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
          sender: userId,
          text,
        },
      });
      if (res.data.status === "success") {
        e.target.classList.remove("disabled");
        const socketMessage = {
          message: res.data.data.message,
          receiverId,
        };
        // * Send the message to the other client
        socket.emit("submitMessage", socketMessage, (ackMes) => {
          //! Use it to confirm the delivery
          console.log(`the message has been ${ackMes}`);
        });

        const newMessage = createMessageElement(res.data.data.message, userId);
        chatBox.appendChild(newMessage);
        autoScroll();
      }
    } catch (err) {
      e.target.classList.remove("disabled");
      showAlert("error", "Fail");
    }
  });
};
