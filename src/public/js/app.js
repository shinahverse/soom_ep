const socket = io();
const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");
const room = document.getElementById("room");

room.hidden = true;

let roomName;

function handleSubmitMessage(event){
    event.preventDefault();
    const input = room.querySelector("#msg input");
    const value = input.value;
    socket.emit("newMessage", value, roomName, ()=>{
        writeMessage(`You: ${value}`);
    });
    input.value = "";
}

function handleSubmitNickName(event){
    event.preventDefault();
    const input = room.querySelector("#name input");
    const value = input.value;
    socket.emit("nickname", value);
    input.value = "";
}

function showRoom(){
    welcome.hidden = true;
    room.hidden = false;
    const h3 = room.querySelector("h3");
    h3.innerText = `[방이름] ${roomName}`;
    const msgForm = room.querySelector("#msg");
    const nameForm = room.querySelector("#name");
    msgForm.addEventListener("submit", handleSubmitMessage);
    nameForm.addEventListener("submit", handleSubmitNickName);
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

socket.on("welcome", (userNickname)=>{
    writeMessage(`${userNickname}님이(가) 입장하였습니다.`);
});

socket.on("bye", (userNickname) => {
    writeMessage(`${userNickname}님이(가) 퇴장하였습니다.`);
});

socket.on("newMessage", (msg)=>{
    writeMessage(msg);
});

