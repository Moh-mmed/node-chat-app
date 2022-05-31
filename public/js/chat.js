import axios from "axios";
const socket = io();
import { showAlert } from "./alerts";
import { createMessageElement } from "./messageBlock";
import { setOnlineFriends } from "./onlineFriend";

const allFriendsContainer = document.querySelector(".friends");
const chatBox = document.querySelector(".chatBox__top");
const inputField = document.querySelector(".chatBox__bottom .chatMessage__Input");

let userId = null
let allFriends = null

if (inputField) {
  userId = inputField.dataset.userId;

  //* Sending userId to websocket
  socket.emit("addUser", userId);
}

//* Socket.io
socket.on("message", async(msg) => {
    const res = await axios({
      method: "GET",
      url: "http://127.0.0.1:8080/api/users",
    });

    const filteredFriends = res.data.data.users.filter(
      (user) => user._id !== userId
    );
    getAllFriends(filteredFriends);
});

//* Get all Users
socket.on("getUsers", async (users) => {
  let onlineUsers;
  users = users.filter((user)=> user.userId !== userId)
  //* Display online friends
  if (!allFriends) {
    const res = await axios({
    method: "GET",
    url: 'http://127.0.0.1:8080/api/users',
    });

    allFriends = res.data.data.users;

    onlineUsers = res.data.data.users.filter((user) =>
      users.some((u) => user._id === u.userId)
    );
  } else {
    onlineUsers = allFriends.filter((user) =>
      users.some((u) => user._id === u.userId)
    );
  }
  
  if (onlineUsers) setOnlineFriends(onlineUsers);
  
});

//* Receive sent messages
socket.on("sendBackMessage", (msg) => {
  if (inputField.dataset.conversationId === msg.conversationId) {
    const newMessage = createMessageElement(msg, userId);
    chatBox.appendChild(newMessage);
    autoScroll();
  }
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
      const messages = data.map((msg) => createMessageElement(msg, userId));
      chatBox.innerHTML = "";
      messages.forEach((msg) => chatBox.appendChild(msg));
      autoScroll();
    });
  });
};

export const getAllFriends = async (friends) => {
  const res = await axios({
    method: "GET",
    url: `http://127.0.0.1:8080/api/conversations`,
  });
  const allConversations = res.data.data.conversations;
  const createFriendWrapper = (friend) => {
    const conversationContainer = document.createElement("div");
    const img = document.createElement("img");
    const friendName = document.createElement("span");

    //* Set class
    conversationContainer.className = "conversation";
    img.className = "conversation__img";
    friendName.className = "conversation__name";

    img.src = `/img/${friend.photo}`;
    friendName.innerHTML = friend.name

    //* Set dataset
    conversationContainer.dataset.receiverId = friend._id; 
    allConversations.forEach(con => {
      con.members.forEach((user) => {
       if(user._id === friend._id)conversationContainer.dataset.conversationId = con._id; 
      });
    })

    conversationContainer.appendChild(img);
    conversationContainer.appendChild(friendName);
   
    //! Check later conversation select
    allFriendsContainer.appendChild(conversationContainer);
  }  
  
  allFriendsContainer.innerHTML = ''
  friends.forEach((friend) => createFriendWrapper(friend));



  //* Add event listener
  allFriendsContainer.childNodes.forEach(item => {
    item.addEventListener("click", async(e) => {
      let target = e.target;
      if (e.target.nodeName === "SPAN" || e.target.nodeName === "IMG")
        target = e.target.parentNode;
      allFriendsContainer.childNodes.forEach(d => d.classList.remove('selected'))
      target.classList.add('selected')

      const receiverId = target.dataset.receiverId;
      const conversationId = target.dataset.conversationId;

      inputField.dataset.conversationId = conversationId;
      inputField.dataset.receiverId = receiverId;

      if (conversationId) {
        //* Continue conversation
        const res = await axios({
          method: "GET",
          url: `http://127.0.0.1:8080/api/messages/${conversationId}`,
        });
        const data = res.data.data.messages;
        const messages = data.map((msg) => createMessageElement(msg, userId));
        chatBox.innerHTML = "";
        messages.forEach((msg) => chatBox.appendChild(msg));
        autoScroll();
      } else {
        //* Start new conversation
        chatBox.innerHTML = `<div class="start_conversation">Send message to start a new conversation</div>"`;
      }
    });
  })

}

export const submitNewMessage = (input, button) => {
  button.addEventListener("click", async (e) => {
    let conversationId = input.dataset.conversationId;
    let receiverId = input.dataset.receiverId;

    if (conversationId === 'undefined') {
      if (input.value === '') return
      try {
        const res = await axios({
          method: "POST",
          url: "http://127.0.0.1:8080/api/conversations",
          data: {
            senderId: userId,
            receiverId,
          },
        });
        if (res.data.status === "success") {
          conversationId = res.data.data.conversation._id;
          document.querySelector(
            `[data-receiver-id='${receiverId}']`
          ).dataset.conversationId = conversationId;
          chatBox.innerHTML = "";
        } else {
          return;
        }
      } catch (err) {
        showAlert("error", "Fail");
        return;
      }
    }
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
          // console.log(`the message has been ${ackMes}`);
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
