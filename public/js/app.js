var socket = io();

socket.on('connect', function () {
	console.log('Connected to socket.io server!');
});

socket.on('message', message => {
	console.log('New message:');
	console.log(message.text);

	const time = moment.utc(message.timestamp).local().format('h:mm a');

	jQuery('.messages').append('<p><strong>' + time + ': </strong>' + message.text + '</p>');
})

// 	Handles submitting of new message
var $form = jQuery('#message-form');

$form.on('submit', event => {

	// Handle event submission button/handling on our own
	event.preventDefault();

	var $message = $form.find('input[name=message]');
	var $timestamp = moment().valueOf();

	socket.emit('message', {
		timestamp: $timestamp,
		text: $message.val()
	});

	$message.val('');
});