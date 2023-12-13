const messageList = document.querySelector("ul");
const messageForm = document.querySelector("form");
const socket = new WebSocket(`ws://${window.location.host}`);

socket.addEventListener("open", ()=>{
    console.log("서버와 연결되었습니다.");
});

socket.addEventListener("message", (message)=>{
    // console.log("서버로부터 받은 메시지: ", message.data);
    const li = document.createElement("li");
    li.innerText = message.data;
    messageList.append(li);
});

socket.addEventListener("close", ()=>{
    console.log("서버와 연결이 끊겼습니다.");
});

function handleSubmit(event){
    event.preventDefault();
    const input = messageForm.querySelector("input");
    socket.send(input.value);
    input.value = "";
};

messageForm.addEventListener("submit", handleSubmit);