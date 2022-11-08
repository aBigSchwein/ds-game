const socket = io.connect();
const ENGINE = {
    init: () => {
        ENGINE.bindEvents();
    },
    bindEvents: () => {
        socket.on('connect', () => { console.log(socket.id); });
        socket.on('roomCreated', ENGINE.roomCreated);
        socket.on('roomJoined', ENGINE.roomJoined);
        socket.on('roomInvalid', ENGINE.roomInvalid);
        socket.on('gameStarted', ENGINE.gameStarted);
        socket.on('wordInvalid', ENGINE.wordInvalid);
        socket.on('revealCard', ENGINE.revealCard);
    },
    roomCreated: (data) => {
        $('#createBlock').hide();
        $('#howToJoin').removeClass('invisible');
        $('#roomInfo').append(`<h1>Room Code: <small>${data.gameId}</small></h1>`);
        App.role = 'Host';
        App.gameId = data.gameId;
    },
    roomJoined: (data) => {
        App[App.role].updatePlayers(data);
    },
    roomInvalid: (data) => {
        App.util.errorMessage(data.message);
        $('#gameId').addClass('is-invalid').focus();
    },
    wordInvalid: (data) => {
        App.util.alertMessage(data.message);
    },
    gameStarted: (data) => {
        App[App.role].gameStarted(data);
    },
    revealCard: (data) => {
        App[App.role].revealCard(data);
    }
}
var App = {
    name: '',
    gameId: '',
    role: 'Player',
    playerTeam: 'BLUE',
    clueGiver: false,
    init: () => {
        App.bindEvents();
    },
    bindEvents: () => {
        $(document)
            .on('click', '#createRoom', App.Host.createRoom)
            .on('click', '#playerTeam', App.Player.setTeam)
            .on('click', '#clueGiver', App.Player.setClueGiver)
            .on('click', '#joinRoom', App.Player.joinRoom)
            .on('click', '#startGame', App.Host.startGame)
            .on('click', '.gameCard', App.Player.pickCard);
    },
    Player:
    {
        setClueGiver: () => {
            if (!$('#clueGiver').is(':checked')) {
                App.clueGiver = true;
                $('#clueGiver').attr('checked', 'checked');
                $('#clueGiver').parent().attr('class', 'btn btn-success');
            }
            else {
                App.clueGiver = false;
                $('#clueGiver').removeAttr('checked');
                $('#clueGiver').parent().attr('class', 'btn btn-outline-secondary');
            }
        },
        setTeam: () => {
            if (!$('#playerTeam').is(':checked')) {
                App.playerTeam = 'RED';
                $('#playerTeam').attr('checked', 'checked');
            }
            else {
                App.playerTeam = 'BLUE';
                $('#playerTeam').removeAttr('checked');
            }
        },
        joinRoom: () => {
            App.name = $('#name').val().toUpperCase();
            App.gameId = $('#gameId').val().toUpperCase();
            socket.emit('joinRoom',
                {
                    name: App.name,
                    gameId: App.gameId,
                    playerTeam: App.playerTeam,
                    clueGiver: App.clueGiver
                });
        },
        updatePlayers: (data) => {
            if (App.gameId === data.gameId) {
                $('#playersInRoom').html('');
                data.playersInRoom.forEach((player) => {
                    App.util.addPlayerToTeam($('#playersInRoom'), player.playerTeam, player.name);
                });
                $('#entryForm').hide();
            }
        },
        gameStarted: (data) => {
            if (App.gameId === data.gameId) {
                if (App.clueGiver) {
                    $('#gameArea').html('').removeClass('row-cols-5');
                    var counts = {};
                    data.legend.forEach(function (x) { counts[x] = (counts[x] || 0) + 1; });
                    var cls = (counts['1'] > counts['2']) ? 'redTeamFirst' : 'blueTeamFirst';
                    var teamText = $('<h3/>').addClass(cls).text((counts['1'] > counts['2']) ? 'Red Team Goes First' : 'Blue Team Goes First');
                    var teamFirst = $('<div/>').addClass('keyCard').append(teamText);
                    var table = $('<table/>')
                    var row = $('<tr/>');
                    data.legend.forEach((pos, index) => {
                        var col = App.util.loadLegendCard(pos);
                        row.append(col);
                        if (index + 1 == 5 || index + 1 == 10 || index + 1 == 15 || index + 1 == 20 || index + 1 == 25) {
                            table.append(row);
                            row = $('<tr/>');
                        }
                        if (index === data.legend.length - 1) {
                            teamFirst.append(table);
                            $('#gameArea').append(teamFirst);
                        }
                    });
                }
                else {
                    $('#gameArea').html('');
                    data.words.forEach((word) => {
                        App.util.loadCard(word);
                    });
                }
            }
        },
        pickCard: (e) => {
            if (App.gameId != '') {
                var gameCard = $(e.currentTarget);
                socket.emit('pickCard', { gameId: App.gameId, word: $(e.currentTarget).attr('word') });
            }
        },
        revealCard: (data) => {
            if (App.gameId === data.gameId) {
                if (App.clueGiver) {
                    //TODO: Adjust the styles for the legend to show it was guessed
                }
                else {
                    var cls = (data.cardType === 3) ? 'assassinCard' : (data.cardType === 2) ? 'blueCard' : (data.cardType === 1) ? 'redCard' : 'neutralCard';
                    $(`.gameCard[word='${data.word}']`).addClass(`revealed ${cls}`);
                }
            }
        }
    },
    Host:
    {
        players: [],
        createRoom: () => {
            socket.emit('createRoom');
        },
        updatePlayers: (data) => {
            if (App.gameId = data.gameId) {
                $('#playersInRoom').html('');
                data.playersInRoom.forEach((player) => {
                    App.util.addPlayerToTeam($('#playersInRoom'), player.playerTeam, player.name);
                });
                if (data.playersInRoom.length >= 2)
                    $('#startGame').removeClass('invisible');
            }
        },
        startGame: () => {
            $('#roomInfo').hide();
            $('#startGame').hide();
            console.log(App.gameId);
            socket.emit('startGame',
                {
                    gameId: App.gameId
                });
        },
        gameStarted: (data) => {
            if (App.gameId === data.gameId) {
                $('#gameArea').html('');
                data.words.forEach((word) => {
                    App.util.loadCard(word);
                });
            }
        },
        revealCard: (data) => {
            if (App.gameId === data.gameId) {
                var cls = (data.cardType === 3) ? 'assassinCard' : (data.cardType === 2) ? 'blueCard' : (data.cardType === 1) ? 'redCard' : 'neutralCard';
                $(`.gameCard[word='${data.word}']`).addClass(`revealed ${cls}`);
            }
        }
    },
    util:
    {
        getTeamImage: (team) => {
            return (team === 'RED') ? '/img/redTeam.png' : '/img/blueTeam.png';
        },
        addPlayerToTeam: (el, team, name) => {
            const cls = (team === 'BLUE') ? 'alert-primary' : 'alert-danger',
                player = $('<div/>');
            $('<img/>').attr('src', App.util.getTeamImage(team)).addClass('playerImg').appendTo(player);
            $('<span/>').addClass('playerInfo').text(' ' + name).appendTo(player);
            el.append($('<div/>').addClass(`col col-sm alert ${cls}`).html(player.html()));
        },
        loadCard: (word) => {
            var col = $('<div/>').addClass('col');
            var gameCard = $('<div/>').addClass('gameCard').attr('word', word);
            $('<span/>').text(word).appendTo(gameCard);
            $('<div/>').text(' ').appendTo(gameCard);
            gameCard.appendTo(col);
            col.appendTo('#gameArea');
        },
        loadLegendCard: (pos) => {
            const cls = (pos === 3) ? 'assassinCard' : (pos === 2) ? 'blueCard' : (pos === 1) ? 'redCard' : 'neutralCard';
            return $('<td/>').addClass(`legendCard ${cls}`).attr('type', pos);
        },
        errorMessage: (msg) => {
            var div = $('<div/>').addClass('alert alert-danger').html(msg)
            $('#message').append(div).fadeOut(3000, () => { $('#message').html('') });
        },
        alertMessage: (msg) => {
            alert(msg);
        },
        fakeGame: (name, gameId, playerTeam, clueGiver) => {
            App.name = name;
            App.gameId = gameId;
            App.playerTeam = playerTeam;
            App.clueGiver = clueGiver;

            $('#entryForm').hide();
            App.util.addPlayerToTeam($('#playersInRoom'), App.playerTeam, App.name, 0);
            socket.emit('fakeGame',
                {
                    name: App.name,
                    gameId: App.gameId,
                    playerTeam: App.playerTeam,
                    clueGiver: App.clueGiver
                });
        }
    }
};
App.init();
ENGINE.init();
//App.util.fakeGame('Drew','ROOM','RED',false);