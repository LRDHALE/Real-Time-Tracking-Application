import express from 'express';
import { createServer } from 'node:http'
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { Server } from 'socket.io'

const PORT = process.env.PORT || 3000;
const __dirname = dirname(fileURLToPath(import.meta.url))

const app = express();
const server = createServer(app);
const io = new Server(server);

app.set('view engine', 'ejs')
app.use(express.static(join(__dirname, 'public')))

app.get('/', (req, res)=>{
    res.render('index')
});

io.on('connection', (socket)=>{
    console.log('a user is connected')

    socket.on("send-location", (coords) => {
        console.log('Location Send')
        
        io.emit("receive-location", { id: socket.id, ...coords });
        console.log('Location Received')
    });

    socket.on('disconnect', ()=>{
        io.emit("user-disconnected", socket.id);
        console.log('a user is disconnected')
    });
})

server.listen(PORT, ()=>{
    console.log(`Server is running at http://localhost:${PORT}`)
})