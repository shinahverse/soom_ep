const socket = io();

const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");

function handleSubmitRoom(event){
    event.preventDefault();
    const input = form.querySelector("input");
    // socket.emit("enterRoom", {payload:input.value});
    socket.emit("enterRoom", input.value, ()=>{
        console.log("server is done!");
    });
    input.value = "";
};

form.addEventListener("submit", handleSubmitRoom);