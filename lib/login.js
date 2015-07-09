var decrypt = require('./decrypt');

module.exports = function(client, channelName, channel) {
	var username = channel.username;
	var password = decrypt(channel.password);

	var handleError = function(err) {
		if(err) {
			// console.log(err);
		}
	}

	if(!username || !password) {
		return;
	}

	switch(channelName) {
		case 'Booking.com':
			client.setValue('#loginname', username, handleError);
			client.setValue('#password', password, handleError);
			client.click('input[name="login"]', handleError);
			break;
		case 'Expedia':
			client.setValue('#emailControl', username, handleError);
			client.setValue('#passwordControl', password, handleError);
			client.click('#signInButton', handleError);
			break;
		case 'HostelBookers':
			client.setValue('#strLogin', username, handleError);
			client.setValue('#strPassword', password, handleError);
			client.click('input[name="login"]', handleError);
			break;
		case 'HostelWorld.com':
			client.setValue('#HostelNumber', channel.hostel_number, handleError);
			client.setValue('#Username', username, handleError);
			client.setValue('#Password', password, handleError);
			client.click('#loginButton > ul > li > a', handleError);
			break;
		case 'Agoda':
			client.setValue('#Username', username, handleError);
			client.setValue('#Password', password, handleError);
			client.click('.ga_LoginSubmit', handleError);
			break;
		case 'BookIt':
			client.setValue('#ctl00_Body_prsSignIn_txtLoginID', username, handleError);
			client.setValue('#ctl00_Body_prsSignIn_txtPassword', password, handleError);
			client.click('input[name="ctl00$Body$prsSignIn$ctl00"]', handleError);
			break;
		case 'AirBnB':
			client.click('.btn-google', handleError);
			break;
		default:
			break;
	}
};