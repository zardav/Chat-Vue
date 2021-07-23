const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
    cors: {
      origin: '*',
    }
  });

io.on('connection', (socket) => {
  console.log('a user connected');
});

app.use(express.static('dist/spa'));

server.listen(3000, () => {
   console.log('listening on *:3000');
 });

let users = {}, users_by_uid = {};
let incremental_id = 0;

function newSocket(socket) {
    console.log("New connection, id: " + socket.id);
    const user = {
        socket,
        user_id: incremental_id++,
        nick: "",
        logon: false
    };
    users[socket.id] = users_by_uid[user.user_id] = user;
    socket.once("login", nick => {
        user.nick = nick;
        socket.on("public message", message => public_message(socket, message));
        socket.on("private message", ({message, user_id}) => private_message(socket, user_id, message));
        socket.on("get users", () => {
            socket.emit("users list", get_user_list());
        });
        emit_logon("user connected", {user_id: user.user_id, nick});
        user.logon = true;
        socket.emit("logon", user.user_id);
        console.log(`User connected: {user_id: ${user.user_id}, nick: ${users[socket.id].nick}}`);
    });

    socket.on("disconnect", () => {
        const {user_id} = users[socket.id];
        delete users_by_uid[user_id];
        delete users[socket.id];
        emit_logon("user disconnected", user_id);
        console.log("Disconnected: " + uuser_id);
    });
}

function emit_logon(event, data) {
    for (const {logon, socket} of Object.values(users)) {
        if (logon) {
            socket.emit(event, data);
        }
    }
}

function get_user_list() {
    return Object.values(users).filter(u=>u.logon).map(({user_id, nick}) => ({user_id, nick}));
}

function public_message(origin_socket, message) {
    const {user_id, nick} = users[origin_socket.id];
    const data = {user_id, nick, message, time: new Date().getTime()};
    emit_logon("public message", data)
    console.log("public message: " + JSON.stringify(data))
}

function private_message(origin_socket, target_id, message) {
    const {user_id, nick} = users[origin_socket.id];
    const target_user = users_by_uid[target_id];
    if (target_user !== undefined) {
        const data = {user_id, nick, message, time: new Date().getTime()};
        target_user.socket.emit("private message", data);
        console.log("private message: " + JSON.stringify(data));
    }
}

io.on('connection', newSocket);