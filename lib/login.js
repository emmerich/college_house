var decrypt = require('./decrypt');

module.exports = function(client, channelName, channel) {
	var username = channel.username;
	var password = decrypt(channel.password);

	console.log('Logging in to channel', channelName, 'with username and password', username, password);

	switch(channelName) {
		case 'Booking.com':
			client.setValue('#loginname', username);
			client.setValue('#password', password);
			client.click('input[name="login"]');
			break;
		case 'Expedia':
			client.setValue('#emailControl', username);
			client.setValue('#passwordControl', password);
			client.click('#signInButton');
			break;
		default:
			break;
	}
};