const socket = io();

const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");
const room = document.getElementById("room");
room.hidden = true;

function showRoom(){
    welcome.hidden = true;
    room.hidden = false;
}

function handleSubmitRoom(event){
    event.preventDefault();
    const input = form.querySelector("input");
    socket.emit("enterRoom", input.value, showRoom);
    input.value = "";
};

form.addEventListener("submit", handleSubmitRoom);