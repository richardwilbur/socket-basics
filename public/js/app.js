var socket = io();

socket.on('connect', function () {
	console.log('Connected to socket.io server!');
});

socket.on('message', message => {
	console.log('New message:');
	console.log(message.text);
})