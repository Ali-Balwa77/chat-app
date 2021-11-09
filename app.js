const express = require('express');
const app = express()
const http = require('http').createServer(app)
const path = require('path')
const port = process.env.PORT || 9000;


app.use(express.static(path.join(__dirname,'/public')))

http.listen(port,()=>{
    console.log(`listening on port ${port}`)
})

app.get('/',(req,res)=>{
    res.send('index');
})

//socket

const io = require('socket.io')(http);

const users = {};

io.on('connection', socket =>{
    socket.on('new-user-joined', name =>{
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
    })

    socket.on('send', message =>{
        socket.broadcast.emit('receive', {message: message, name: users[socket.id]})
    })
    
    socket.on('disconnect', message =>{
        socket.broadcast.emit('left', users[socket.id])
        delete users[socket.id]
    })
})
