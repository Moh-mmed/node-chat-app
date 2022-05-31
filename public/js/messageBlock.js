// import * as timeago from "timeago.js";
import {format} from "timeago.js";

export const createMessageElement = (message, userId) => {
  const messageWrapper = document.createElement("div");
  const messageTop = document.createElement("div");
  const img = document.createElement("img");
  const messageText = document.createElement("p");
  const messageBottom = document.createElement("div");
  messageWrapper.className = `message ${
    message.sender._id === userId ? "own" : ""
  }`;
  messageTop.className = "message__top";
  img.src = `/img/${message.sender.photo}`;
  img.className = "message__img";
  messageText.className = "message__text";
  messageBottom.className = "message__bottom";

  messageBottom.innerHTML = format(message.createdAt);
  messageText.innerHTML = message.text;
  messageTop.appendChild(img);
  messageTop.appendChild(messageText);
  messageWrapper.appendChild(messageTop);
  messageWrapper.appendChild(messageBottom);
  return messageWrapper;
};
