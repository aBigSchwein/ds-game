import Logging from '../../logging.js';

const PickCard = async (io, socket, data) => {
    Logging('INFO', `PickCard: ${data}, ${socket.currentGame}`);
    var room = io.sockets.adapter.rooms.get(data.gameId);
    if (room != undefined) {
        const word = data.word,
            currentGame = socket.currentGame;
        if (currentGame.words.includes(word)) {
            socket.currentGame.cardsRevealed++;
            io.sockets.in(data.gameId).emit('revealCard', { gameId: data.gameId, word: data.word, cardType: currentGame.legend[currentGame.words.indexOf(word)] });
            Logging('DEBUG', `RevealCard: ${JSON.stringify({ gameId: data.gameId, word: data.word, cardType: currentGame.legend[currentGame.words.indexOf(word)] }, null, 4)}`);
        }
        else {
            socket.emit('wordInvalid', { message: word + ' is not a valid word in this game.' });
            Logging('DEBUG', `RevealCard (${data.gameId}): Invalid word, ${word}`);
        }
    }
    else {
        socket.emit('roomInvalid', { message: 'This game is over or no longer exists. Start a new game!' })
        Logging('ERROR', `Room Invalid: ${data.gameId}`);
        Logging('DEBUG', `Rooms: ${data.gameId} ${JSON.stringify(io.sockets.adapter.rooms, null, 4)}`);
    }
};

export default PickCard;