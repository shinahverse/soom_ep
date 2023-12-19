const socket = io();
const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");
const room = document.getElementById("room");

room.hidden = true;

let roomName;

function showRoom(){
    welcome.hidden = true;
    room.hidden = false;
    const h3 = room.querySelector("h3");
    h3.innerText = `[방이름] ${roomName}`;
}

function handleSubmitRoom(event){
    event.preventDefault();
    const input = form.querySelector("input");
    socket.emit("enterRoom", input.value, showRoom);
    roomName = input.value;
    input.value = "";
};

function writeMessage(message){
    const ul = room.querySelector("ul");
    const li = document.createElement("li");
    li.innerText = message;
    ul.appendChild(li);
}

form.addEventListener("submit", handleSubmitRoom);

socket.on("welcome", ()=>{
    writeMessage("누군가 들어왔습니다.");
});