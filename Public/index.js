const chatForm = document.getElementById("chat-form");
const socket = io();

//Message  from server
socket.on("message", (message) => {
  console.log(message);
  outputMessage(message);
});

//Message submit

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const msg = e.target.elements.msg.value;

  //emit message to server
  socket.emit("chat-message", msg);
});

//output message to dom

function outputMessage(message) {
  const div = document.createElement("div");
  div.setAttribute("class", "meta");
}
