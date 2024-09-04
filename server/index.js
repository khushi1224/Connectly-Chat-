const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const socket = require("socket.io");
const userRoutes  = require("../server/routes/userRoutes");
const messageRoutes= require("../server/routes/messages")
const app = express();
require("dotenv").config();


app.use(cors());

app.use(express.json());

app.use("/api/auth",userRoutes);







mongoose.connect(process.env.MONGO_URL).then(()=>{
    console.log("Connected to MongoDB");
}).catch((err)=>{
    console.error("Error connecting to MongoDB",err);
})





app.get("/ping", (_req, res) => {
    return res.json({ msg: "Ping Successful" });
  });
  
  app.use("/api/auth", userRoutes);
  app.use("/api/messages", messageRoutes);



const server = app.listen(process.env.PORT,(req,res)=>{
    console.log(`Server running on port ${process.env.PORT}`);
})
const io = socket(server, {
    cors: {
      origin: "http://localhost:3000",
      credentials: true,
    },
  });
  
  global.onlineUsers = new Map();
  io.on("connection", (socket) => {
    global.chatSocket = socket;
    socket.on("add-user", (userId) => {
      onlineUsers.set(userId, socket.id);
    });
  
    socket.on("send-msg", (data) => {
      const sendUserSocket = onlineUsers.get(data.to);
      if (sendUserSocket) {
        socket.to(sendUserSocket).emit("msg-recieve", data.msg);
      }
    });
  });