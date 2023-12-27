const socket = io();

const myFace = document.getElementById("myFace");
const btnMute = document.getElementById("mute");
const btnCamera = document.getElementById("camera");
const selectCamera = document.getElementById("cameras");
const call = document.getElementById("call");


let myStream;
let muted = false;
let cameraOff = false;
let roomName;


async function getCameras(){
    try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        console.log(devices);
        const cameras = devices.filter((device) => device.kind === "videoinput");
        const currentCamera = myStream.getVideoTracks()[0];
        cameras.forEach((camera) => {
            const option = document.createElement("option");
            option.value = camera.deviceId;
            option.innerText = camera.label;
            if (currentCamera.label == camera.label){
                option.selected = true;
            }
            selectCamera.appendChild(option)
        });
    } catch (e) {
        console.log(e);
    }
}

async function getMedia(deviceId){
    const initialConstraints = {
        audio : true,
        video : {facingMode : "user"}
    };
    const cameraConstraints = {
        audio : true,
        video : {deviceId: {exact: deviceId}}
    };
    try{
        myStream = await navigator.mediaDevices.getUserMedia(
            deviceId ? cameraConstraints : initialConstraints
        );
    
        //console.log(myStream);
        myFace.srcObject = myStream;
        if (!deviceId){
            await getCameras();
        }
    }catch(e){
        console.log(e);
    }
}

//getMedia();
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

async function handleChangeCamera(){
    //console.log(selectCamera.value);
    await getMedia(selectCamera.value);
}


btnMute.addEventListener("click", handleMute);
btnCamera.addEventListener("click", handleCamera);
selectCamera.addEventListener("input", handleChangeCamera);

//welcome form 에 대한 코드
const welcome = document.getElementById("welcome");
const wecomeForm = welcome.querySelector("form");

call.hidden = true;

function startMedia(){
    welcome.hidden = true;
    call.hidden = false;
    getMedia();
}

function handleWelcome(event){
    event.preventDefault();
    const input = wecomeForm.querySelector("input");
    socket.emit("joinRoom", input.value, startMedia);
    roomName = input.value;
    input.value = "";
}
wecomeForm.addEventListener("submit", handleWelcome);

//Socket Code
socket.on("welcome", ()=>{
    console.log("누군가 입장했습니다.");
});
