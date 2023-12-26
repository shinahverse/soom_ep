const socket = io();

const myFace = document.getElementById("myFace");
const btnMute = document.getElementById("mute");
const btnCamera = document.getElementById("camera");

let myStream;
let muted = false;
let cameraOff = false;

async function getMedia(){
    try{
        myStream = await navigator.mediaDevices.getUserMedia({
            audio : true,
            video : true,
        });
    
        //console.log(myStream);
        myFace.srcObject = myStream;
    }catch(e){
        console.log(e);
    }
}

getMedia();
function handleMute(){
    console.log(myStream.getAudioTracks());
    if(!muted){
        btnMute.innerText = "음소거해제";
        muted = true;
    }else {
        btnMute.innerText = "음소거";
        muted = false;
    }
}

function handleCamera() {
    console.log(myStream.getVideoTracks());
    if (!cameraOff){
        btnCamera.innerText = "카메라 켜짐";
        cameraOff = true;
    }else {
        btnCamera.innerText = "카메라 꺼짐";
        cameraOff = false;
    }
}
btnMute.addEventListener("click", handleMute);
btnCamera.addEventListener("click", handleCamera);