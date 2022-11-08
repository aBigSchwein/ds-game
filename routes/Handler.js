import Logging from '../logging.js';
import CreateRoom from './controllers/CreateRoom.js';
import JoinRoom from './controllers/JoinRoom.js';
import StartGame from './controllers/StartGame.js';
import PickCard from './controllers/PickCard.js';
import FakeGame from './controllers/FakeGame.js';

const Handler = async (io) => {
    io.on('connection', (socket) => {
        Logging('DEBUG', `Connected: ${socket.id}`);
        socket.on('createRoom', (data) => CreateRoom(io, socket, data));
        socket.on('joinRoom', (data) => JoinRoom(io, socket, data));
        socket.on('startGame', (data) => StartGame(io, socket, data));
        socket.on('pickCard', (data) => PickCard(io, socket, data));
        socket.on('fakeGame', (data) => FakeGame(io, socket, data));
    });
};

export default Handler;