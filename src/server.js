import express from 'express';

const app = express();

const handleListen = ()=> console.log("서버 대기중 http://localhost:3000");
app.listen(3000, handleListen);