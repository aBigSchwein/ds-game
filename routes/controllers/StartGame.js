import Logging from '../../logging.js';
import { getRandomWords, getNewLegend } from '../../words.js';

const StartGame = async (io, socket, data) => {
    Logging('INFO', `StartGame: ${data.gameId}`);
    var room = io.sockets.adapter.rooms.get(data.gameId);
    if (room != undefined) {
        data.round = 0; //TODO: Figure out how to implement turns
        data.words = getRandomWords();
        data.legend = getNewLegend();
        for (const playerId of room.values()) {
            var s = io.sockets.sockets.get(playerId);
            s.currentGame = { words: data.words, legend: data.legend, cardsRevealed: 0 };
        }
        io.sockets.in(data.gameId).emit('gameStarted', data);
        Logging('DEBUG', `StartGame: ${JSON.stringify(data, null, 4)}`);
    }
    else {
        socket.emit('roomInvalid', { message: 'This game is over or no longer exists. Start a new game!' })
        Logging('ERROR', `Room Invalid: ${data.gameId}`);
        Logging('DEBUG', `Rooms: ${data.gameId} ${JSON.stringify(io.sockets.adapter.rooms, null, 4)}`);
    }
};

export default StartGame;