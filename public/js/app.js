var socket = io();
var name = getQueryVariable('name') || 'Anonymous';
var room = getQueryVariable('room');

console.log(`${name} wants to join ${room}`);

socket.on('connect', function () {
	console.log('Connected to socket.io server!');
});

socket.on('message', message => {
	var momentTimestamp = moment.utc(message.timestamp);
	var $messages = jQuery('.messages');

	console.log('New message:');
	console.log(message.text);

	$messages.append('<p><strong>' + message.name + ' ' + momentTimestamp.local().format('h:mm a') + '</strong></p>');
	$messages.append('<p>' + message.text + '</p>');
})

// 	Handles submitting of new message
var $form = jQuery('#message-form');

$form.on('submit', event => {

	// Handle event submission button/handling on our own
	event.preventDefault();

	var $message = $form.find('input[name=message]');

	socket.emit('message', {
		name: name,
		text: $message.val()
	});

	$message.val('');
});