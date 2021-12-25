const chatForm = document.getElementById("chat-form");
const chatMessagebox = document.querySelector(".chat-message");
const roomName=document.getElementById('room-name')
const userList=document.getElementById('users')

//Get username and room from url

const {username,room} =Qs.parse(location.search,{
    ignoreQueryPrefix:true
})

const socket = io();
//Join chatroom

socket.emit('joinRoom',{username,room})

//Get room and users

socket.on('roomUsers',({room,users})=>{
    outputRoomName(room);
    outputUserName(users)
})

//Message  from server
socket.on("message", (message) => {
  console.log(message);
  outputMessage(message);

  chatMessagebox.scrollTop = chatMessagebox.scrollHeight;
});

//Message submit

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const msg = e.target.elements.msg.value;

  //emit message to server
  socket.emit("chat-message", msg);

  e.target.elements.msg.value = "";
  e.target.elements.msg.focus() = "";
});

//output message to dom

function outputMessage(message) {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = ` <p class="meta">${message.username}  <span>${message.time}</span></p>
  <p class="text">
   ${message.text}
  </p>`;
  document.querySelector(".chat-message").append(div);
}


//Add room name to Dom

function outputRoomName(room){
roomName.innerText=room
}

//Add users to Dom

function outputUserName(users){
    userList.innerHTML=`
    ${users.map(user=>`<li>${user.username}</li>`).join('')}`
}