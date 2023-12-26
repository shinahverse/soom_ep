import http from "http";
import SocketIO from "socket.io";
import express from "express";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname+"/views");
app.use("/public", express.static(__dirname+ "/public"));

app.get("/", (req,res)=> res.render("home"));
app.get("/*", (req,res)=>res.redirect("/"));

const httpServer = http.createServer(app);
const wsServer = SocketIO(httpServer);

function publicRooms(){
    // const sids = wsServer.sockets.adapter.sids;
    // const rooms = wsServer.sockets.adapter.rooms;
    const{
        sockets:{
            adapter:{
                sids, rooms
            }
        }
    } = wsServer;
    //구조 분해 할당

    const publicRooms = [];
    //rooms.forEach((value, key) => {
    rooms.forEach((_, key) => {
        if (sids.get(key) === undefined){
            publicRooms.push(key)
        }
    });
    return publicRooms;
}

function countRoom(roomName){
    return wsServer.sockets.adapter.rooms.get(roomName)?.size;
}

wsServer.on("connection", (socket)=>{
    socket["nickname"] = "익명";

    socket.onAny((event) => {
        console.log(wsServer.sockets.adapter);
        console.log(`Socket Event : ${event}`);
    });

    socket.on("enterRoom", (roomName, done)=> {
        done();
        socket.join(roomName);
        socket.to(roomName).emit("welcome", socket.nickname, countRoom(roomName));
        wsServer.sockets.emit("changeRoom", publicRooms());
    });

    socket.on("disconnect", ()=>{
        wsServer.sockets.emit("changeRoom", publicRooms());
    });

    socket.on("disconnecting", ()=>{
        socket.rooms.forEach(room => 
            socket.to(room).emit("bye", socket.nickname, countRoom(room)-1));
    });

    socket.on("newMessage", (msg, room, done) => {
        socket.to(room).emit("newMessage", `${socket.nickname} : ${msg}`);
        done();
    });

    socket.on("nickname", (nickname) => (socket["nickname"] = nickname));

});

const handleListen = ()=> console.log("서버 대기중 http://localhost:3000");

httpServer.listen(3000, handleListen);