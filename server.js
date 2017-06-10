var PORT = process.env.PORT || 3000;
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var moment = require('moment');

app.use(express.static(__dirname + '/public'));

var clientInfo = {};

io.on('connection', socket => {
	console.log('User connected via socket.io');

	socket.on('disconnect', () => {
		var userData = clientInfo[socket.id];

		if (typeof userData !== 'undefined') {
			// Use socket.leave feature to leave a room
			socket.leave(userData.room);

			io.to(userData.room).emit('message', {
				name: 'System',
				timestamp: moment().valueOf(),
				text: userData.name + ' has left!'
			});

			delete clientInfo[socket.id];
		}
	});

	socket.on('joinRoom', request => {
		// Store the room name and other info using socket.Id as the key
		clientInfo[socket.id] = request;

		// Use socket.io room feature to add/join a room
		socket.join(request.room);

		// Send message to all in the room, except the sender:
		socket.broadcast.to(request.room).emit('message', {
			name: 'System',
			timestamp: moment().valueOf(),
			text: request.name + ' has joined!'
		});
	});

	socket.on('message', message => {
		console.log('Message recieved:' + message.text);

		// Send message to all but sender:
		// socket.broadcast.emit('message', message);
		
		message.timestamp = moment().valueOf(),
		
		// Send message to all:
		io.to(clientInfo[socket.id].room).emit('message', message);
	});

	socket.emit('message', {
		name: 'System',
		timestamp: moment().valueOf(),
		text: 'Welcome to the chat application!'
	});
});

http.listen(PORT, () => {
	console.log('Server listening on port ' + PORT);
});