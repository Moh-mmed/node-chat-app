// .chatOnline__friend
//         .chatOnline__imgContainer
//           img.chatOnline__img(src='/img/default.png' alt='user')
//           .chatOnline__Badge
//         span.chatOnline__Name Karim
const onlineFriendsContainer = document.querySelector(".chatOnline");

const createFriendBlock = (friend) => {
    const container = document.createElement('div')
    const imgContainer = document.createElement('div')
    const friendName = document.createElement('span')
    const img = document.createElement('img')
    const badge = document.createElement('div')

    //* Set Class
    container.className = "chatOnline__friend";
    imgContainer.className = "chatOnline__imgContainer";
    friendName.className = "chatOnline__Name";
    img.className = "chatOnline__img";
    badge.className = "chatOnline__Badge";

    //* Set content
    container.innerHTML = friend.name;
    img.src = `/img/${friend.photo}`;
    badge.className = "chatOnline__Badge";

    //* Append content
    imgContainer.appendChild(img);
    imgContainer.appendChild(badge);
    container.appendChild(imgContainer);
    container.appendChild(friendName);

    return container;
}

export const setOnlineFriends = (onlineFriends) => {
    onlineFriendsContainer.innerHTML = "";
    
    onlineFriends.forEach(friend => {
      onlineFriendsContainer.appendChild(createFriendBlock(friend));
  })
}