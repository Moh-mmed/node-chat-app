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
export const createMessageElement = (message, userId) => {
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
