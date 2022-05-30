// import { updateSettings } from "./updateSettings";
import { showAlert } from "./alerts";
import { login, logout } from "./login";
import signup from "./signup";
import {
  getConversations,
  submitNewMessage,
} from "./chat";


// DOM ELEMENTS
const loginForm = document.querySelector(".form--login");
const signupForm = document.querySelector(".form--signup");
const logOutBtn = document.querySelector(".nav__el--logout");
const conversations = document.querySelectorAll(".conversation")
const newMessageInput = document.querySelector(
  ".chatBox__bottom .chatMessage__Input"
);
const newMessageButton = document.querySelector(".chatBox__bottom .chatSubmit__button")

// Code
if (loginForm) loginForm.addEventListener("submit", login);

if (signupForm) signupForm.addEventListener("submit", signup);

if (logOutBtn) logOutBtn.addEventListener("click", logout);

if (conversations) getConversations(conversations, newMessageInput);
  
if (newMessageInput) submitNewMessage(newMessageInput, newMessageButton)


const alertMessage = document.querySelector("body").dataset.alert;
if (alertMessage) showAlert("success", alertMessage, 10);
