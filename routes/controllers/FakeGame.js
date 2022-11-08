import Logging from '../../logging.js';
import { getRandomWords, getNewLegend } from '../../words.js';

const FakeGame = async (io, socket, data) => {
    Logging('INFO', `FakeGame: ${data.gameId}`);
    socket.join(data.gameId);
    socket.name = data.name;
    socket.playerTeam = data.playerTeam;
    socket.clueGiver = data.clueGiver;
    socket.connectionType = "Player";
    var room = io.sockets.adapter.rooms.get(data.gameId);
    var playersInRoom = [];
    for (const playerId of room.values()) {
        var s = io.sockets.sockets.get(playerId);
        if (s.connectionType === "Player" && s.connected === true)
            playersInRoom.push({ name: s.name, playerTeam: s.playerTeam, clueGiver: s.clueGiver });
    }
    data.playersInRoom = playersInRoom;
    data.round = 0; //TODO: Figure out how to implement turns
    data.words = getRandomWords();
    data.legend = getNewLegend();
    socket.currentGame = { words: data.words, legend: data.legend, cardsRevealed: 0 };
    io.sockets.in(data.gameId).emit('gameStarted', data);
    Logging('DEBUG', `FakeGame: ${JSON.stringify(data, null, 4)}`);
};

export default FakeGame;