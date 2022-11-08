import Logging from '../../logging.js';

const CreateRoom = async (io, socket, data) => {
    Logging('DEBUG', `CreateRoom: ${socket.id}`);
    var gameId = '';
    for (var i = 0; i < 4; i++) {
        gameId += 'ABCDEFGHJKLMNPQRSTUVWXYZ123456789'.charAt(Math.floor(Math.random() * 33));
    }
    socket.emit('roomCreated', { gameId: gameId.toUpperCase(), socketId: socket.id });
    socket.connectionType = "Host";
    socket.join(gameId.toUpperCase());
    Logging('DEBUG', `Room Created: ${JSON.stringify({ gameId: gameId.toUpperCase(), socketId: socket.id }, null, 4)}`);
};

export default CreateRoom;