var webdriverio = require('webdriverio');
var fs = require('fs');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');

// The PORT that the web server will run on.
var PORT = 8080;

// Load the application configuration file
var config = JSON.parse(fs.readFileSync('configuration.json', 'utf8'));

// Options for webdriver.
var webdriverOpts = {
	desiredCapabilities: {
		browserName: 'chrome',
		chromeOptions: {
			// Try to use the default profile
			args: ['--user-data-dir=Library/Application Support/Google/Chrome/']
		}
	}
};

// Initialize the WebDriver client.
var client = webdriverio.remote(webdriverOpts).init();

// Set up Express to handle HTTP requests
// Static will ensure any requests for files go to the file system.
app.use(express.static('.'));

// Body Parser turns JSON POST data into JavaScript objects
app.use(bodyParser.json());

// Get all channels currently loaded in the application.
app.get('/channels', function (req, res) {
	res.type('json');
	res.send(Object.keys(config.channels));
});

// Open channels. The names of the channels to open will be in the request body
app.post('/open_channels', function (req, res) {
	req.body.channels.forEach(function(channel) {
		// Look up the channel in the configuration object
		var channelLookup = config.channels[channel];

		// Open the channel in a new window
		client.newWindow(channelLookup.url);
	});

	res.status(200).end();
});

// Exit the application.
app.get('/exit', function(req, res) {
	client.end();
	client.call(process.exit);
	res.status(200).end();
});

// Run the HTTP server
var server = app.listen(PORT, function () {
	var host = server.address().address;
	var port = server.address().port;

	console.log('College House Management Application running on http://%s:%s', host, port);

  	// Now open a new web browser and go to the management page.
	client.url('http://localhost:' + PORT);
});