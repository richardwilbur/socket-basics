var PORT = process.env.PORT || 3000;
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/public'));

io.on('connection', socket => {
	console.log('User connected via socket.io');

	socket.on('message', message => {
		console.log('Message recieved:' + message.text);

		// Send message to all but sender:
		// socket.broadcast.emit('message', message);
		
		// Send message to all:
		io.emit('message', message);
	});


	socket.emit('message', {
		text: 'Welcome to the chat application!'
	});
});

http.listen(PORT, () => {
	console.log('Server listening on port ' + PORT);
});