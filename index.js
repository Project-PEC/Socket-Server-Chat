const io = require('socket.io')(process.env.PORT||8900, {
    cors: {
        origin: "https://coinxchange.herokuapp.com/"
    }
});
let users = []
const addUser = (userId, socketId, userImage) => {
    !users.some(user => user.userId === userId) &&
        users.push({ userId, socketId, userImage });
}
const removeUser = (socketId) => {
    users = users.filter(user => user.socketId !== socketId);
}
const getUser = (userId) => {
    return users.find(user => user.userId === userId);
}
io.on("connection", (socket) => {
    console.log("a user connected.");
    // io.emit("Welcome","Hello this is socket server");
    socket.on("addUser", (userId, userImage) => {
        addUser(userId, socket.id, userImage);
        io.emit("getUsers", users);
    })

    //send
    socket.on('sendMessage', ({ senderId, receiverId, text }) => {
        const user = getUser(receiverId);
        io.to(user.socketId).emit("getMessage", {
            senderId,
            text,
            receiverId
        })
    })
    //when disconnect
    socket.on('disconnect', () => {
        console.log("A user disconnected!");
        removeUser(socket.id);
        io.emit("getUsers", users);
    })
    socket.on('forceDisconnect', () => {
        console.log("A user disconnected!");
        removeUser(socket.id);
        io.emit("getUsers", users);
    })
    
})
