
// import { updateSettings } from "./updateSettings";
// import { showAlert } from "./alerts";
// DOM ELEMENTS
const loginForm = document.querySelector(".form--login");
const signupForm = document.querySelector(".form--signup");
const logOutBtn = document.querySelector(".nav__el--logout");
const conversations = document.querySelectorAll(".conversation")
const chatBox = document.querySelector(".chatBox__top");
const newMessageInput = document.querySelector(
  ".chatBox__bottom .chatMessage__Input"
);
function keepChatBoxScrolledDown() {
  chatBox.scrollTop = chatBox.scrollHeight;
}
keepChatBoxScrolledDown();
const hideAlert = () => {
  const el = document.querySelector(".alert");
  if (el) el.parentElement.removeChild(el);
};

const showAlert = (type, msg, time = 7) => {
  hideAlert();
  const markup = `<div class="alert alert--${type}">${msg}</div>`;
  document.querySelector("body").insertAdjacentHTML("afterbegin", markup);
  window.setTimeout(hideAlert, time * 1000);
};
const getAppropriateDate = (prevMsgDate, currMsgDate) => {
  const messageDate = document.createElement("div");
  messageDate.className = "message__date";
  messageDate.innerHTML = "SUN AT 20:22";
  const displayedDate = "SUN AT 20:22"; // compare currMsg time with the previous one
  prevMsgDate = new Date(prevMsgDate);
  currMsgDate = new Date(currMsgDate);
  const diffTime = Math.abs(currMsgDate - prevMsgDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  // console.log(diffTime + " milliseconds");
  // console.log(diffDays + " days");
  // return null
  return messageDate;
};
const createMessageElement = (message, userId) => {
  const messageWrapper = document.createElement("div");
  const messageTop = document.createElement("div");
  const img = document.createElement("img");
  const messageText = document.createElement("p");
  const messageBottom = document.createElement("div");
  const messageDate = getAppropriateDate(message.createdAt, message.createdAt);

  messageWrapper.className = `message ${
    message.sender._id === userId ? "own" : ""
    }`;
  messageTop.className = "message__top";
  img.src = `/img/${message.sender.photo}`;
  img.className = "message__img";
  messageText.className = "message__text";
  // messageBottom.className = "message__bottom";

  if (messageDate) messageWrapper.appendChild(messageDate);

  messageText.innerHTML = message.text;
  messageTop.appendChild(img);
  messageTop.appendChild(messageText);
  messageWrapper.appendChild(messageTop);
  return messageWrapper;
};

if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        try {
            const res = await axios({
              method: "POST",
              url: "http://127.0.0.1:8080/api/auth-login",
              data: {
                email,
                password,
              },
            });
            if (res.data.status === "success") {
                showAlert("success", "Logged in successfully!");
                window.setTimeout(() => {
                    location.assign("/");
                }, 1500);
            }
        } catch (err) {
              showAlert("error", "Incorrect email or password");
        }
    });
}
if (signupForm)
    signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const passwordConfirm = document.getElementById("password_confirm").value;
    try {
    const res = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:8080/api/auth-signup',
      data: {
        name,
        email,
        password,
        passwordConfirm,
      },
    });

    if (res.data.status === "success") {
      showAlert("success", "Logged in successfully!");
        window.setTimeout(() => {
        location.assign("/messages");
        }, 1500);
    }
    } catch (err) {
        showAlert("error", err.response.data.message);
    }
});

if (logOutBtn) {

    const logout = async () => {
        try {
            const res = await axios({
              method: 'GET',
              url: 'http://127.0.0.1:8080/api/auth-logout',
            });
          if ((res.data.status = "success")) {
              window.setTimeout(() => {
                location.assign("/login");
              }, 1500);
            }
        } catch (err) {
            showAlert("error", "Error logging out! Try again.");
        }
    }

    logOutBtn.addEventListener("click", logout);
    
}

if (conversations) {
  conversations.forEach(item => {
    const conversationId = item.dataset.conversationId;
    item.addEventListener('click', async (e) => {
      newMessageInput.dataset.conversationId = conversationId;
      conversations.forEach(con => con.classList.remove('selected'))
      item.classList.add('selected')
      const res = await axios({
        method: "GET",
        url: `http://127.0.0.1:8080/api/messages/${conversationId}`,
      });
      const data = res.data.data.messages
      const userId = res.data.data.userId
      const messages = data.map((msg) =>
        createMessageElement(msg, userId)
      );
      chatBox.innerHTML = ''
      messages.forEach(msg=> chatBox.appendChild(msg))
      keepChatBoxScrolledDown();
    })
  })
}

if (newMessageInput) {

  document.querySelector(".chatBox__bottom .chatSubmit__button").addEventListener('click',async (e) => {
    const conversationId = newMessageInput.dataset.conversationId;
    const sender = newMessageInput.dataset.userId;
    const text = newMessageInput.value.trim();
    newMessageInput.value= ''
    newMessageInput.focus()
    e.target.classList.add("disabled")
    try {
      const res = await axios({
        method: "POST",
        url: "http://127.0.0.1:8080/api/messages",
        data: {
          conversationId,
          sender,
          text
        },
      });

      if (res.data.status === "success") {
        e.target.classList.remove("disabled");
        const newMessage = createMessageElement(res.data.data.message, sender)
        chatBox.appendChild(newMessage);
        keepChatBoxScrolledDown()
      }
    } catch (err) {
      e.target.classList.remove("disabled");
      showAlert("error", "Fail");
    }

  })
}

const alertMessage = document.querySelector("body").dataset.alert;
if (alertMessage) showAlert("success", alertMessage, 10);
