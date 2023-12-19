const socket = io();
const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");
const room = document.getElementById("room");

room.hidden = true;

let roomName;

function handleSubmitMessage(event){
    event.preventDefault();
    const input = room.querySelector("input");
    const value = input.value;
    socket.emit("newMessage", value, roomName, ()=>{
        writeMessage(`You: ${value}`);
    });
    input.value = ""
}

function showRoom(){
    welcome.hidden = true;
    room.hidden = false;
    const h3 = room.querySelector("h3");
    h3.innerText = `[방이름] ${roomName}`;
    const form = room.querySelector("form");
    form.addEventListener("submit", handleSubmitMessage);
}

function handleSubmitRoom(event){
    event.preventDefault();
    const input = form.querySelector("input");
    socket.emit("enterRoom", input.value, showRoom);
    roomName = input.value;
    input.value = "";
};

//화면에 메시지 표시
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

socket.on("bye", () => {
    writeMessage("누군가 나갔습니다.");
});

socket.on("newMessage", (msg)=>{
    writeMessage(msg);
});