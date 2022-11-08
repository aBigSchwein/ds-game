import Logging from '../../logging.js';

const JoinRoom = async (io, socket, data) => {
    Logging('INFO', `JoinRoom: Player ${data.name} for team ${data.playerTeam} attempting to join game ${data.gameId}`);
    var room = io.sockets.adapter.rooms.get(data.gameId);
    if (room != undefined) {
        data.socketId = socket.id;
        socket.name = data.name;
        socket.connectionType = "Player";
        socket.playerTeam = data.playerTeam;
        socket.clueGiver = data.clueGiver;
        socket.join(data.gameId);
        var playersInRoom = [];
        for (const playerId of room.values()) {
            var s = io.sockets.sockets.get(playerId);
            if (s.connectionType === "Player" && s.connected === true)
                playersInRoom.push({ name: s.name, playerTeam: s.playerTeam, clueGiver: s.clueGiver });
        }
        data.playersInRoom = playersInRoom;
        io.sockets.in(data.gameId).emit('roomJoined', data);
        Logging('DEBUG', `Room Joined: ${JSON.stringify(data, null, 4)}`);
    }
    else {
        socket.emit('roomInvalid', { message: 'This game is over or no longer exists. Start a new game!' })
        Logging('ERROR', `Room Invalid: ${data.gameId}`);
        Logging('DEBUG', `Rooms: ${data.gameId} ${JSON.stringify(io.sockets.adapter.rooms, null, 4)}`);
    }
};

export default JoinRoom;