import express from 'express';
import cors from 'cors';
import { mongodbConnection } from './configs/db_config.js';
import { redis } from './configs/redis_config.js';
import blogRouter from './router/blog_router.js';
import http from "http";
import { Server } from "socket.io";



const app = express();
const server = http.createServer(app);

export const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
})

io.on("connection", (socket) => {
    console.log(`a user connected ${socket.id}`)
    const userId = socket.handshake.auth.userId;
    if (userId) {
        socket.join(userId);
    }
});

app.use(cors());
app.use(express.json());

mongodbConnection();

redis.on('connect', () => {
    console.log('Connected to Redis');
})

redis.on('error', (err) => {
    console.log('Error connecting to Redis', err);
})

app.get('/health', (req, res) => {
    res.json({ message: "Server is running" });
})

// routings

app.use('/api/v1/blog', blogRouter);


//server setup
server.listen(8002, () => {
    console.log('Server is running on port 8002');
});