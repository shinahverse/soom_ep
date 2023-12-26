const socket = io();

const myFace = document.getElementById("myFace");
const btnMute = document.getElementById("mute");
const btnCamera = document.getElementById("camera");
const selectCamera = document.getElementById("cameras");

let myStream;
let muted = false;
let cameraOff = false;

async function getCameras(){
    try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        console.log(devices);
        const cameras = devices.filter((device) => device.kind === "videoinput");
        cameras.forEach((camera) => {
            const option = document.createElement("option");
            option.value = camera.deviceId;
            option.innerText = camera.label;
            selectCamera.appendChild(option)
        });
    } catch (e) {
        console.log(e);
    }
}

async function getMedia(){
    try{
        myStream = await navigator.mediaDevices.getUserMedia({
            audio : true,
            video : true,
        });
    
        //console.log(myStream);
        myFace.srcObject = myStream;
        await getCameras();
    }catch(e){
        console.log(e);
    }
}

getMedia();
function handleMute(){
    // console.log(myStream.getAudioTracks());
    myStream.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled;        
    });
    if(!muted){
        btnMute.innerText = "음소거해제";
        muted = true;
    }else {
        btnMute.innerText = "음소거";
        muted = false;
    }
}

function handleCamera() {
    // console.log(myStream.getVideoTracks());
    myStream.getVideoTracks().forEach((track)=>{
        track.enabled = !track.enabled;
    });
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