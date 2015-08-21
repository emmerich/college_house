var webdriverio = require('webdriverio');
var fs = require('fs');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var child_process = require('child_process');
var spawn = child_process.spawn;
var login = require('../lib/login');
var client;
var server;

// Load the application configuration file
var config = JSON.parse(fs.readFileSync('configuration.json', 'utf8'));

var chromePath = config.chromePath;
var chromeUserDirectory = config.chromeUserDirectory;
var psCommand = config.psCommand;

// Check if chrome is running
var chrome;

try {
	chrome = String(child_process.execSync(psCommand + " | grep " + chromePath)).trim();
} catch(e) {
	console.log(e);
}

if(chrome) {
	var numberOfProcesses = chrome.match(/\n/g).length;

	// There should only be one process with Chrome running (the grep). If more, tell the user to close the browser.
	if(numberOfProcesses > 1) {
		console.log('Please close Google Chrome (Cmd+Q on Mac, Alt+F4 on Windows) before proceeding.');
		process.exit(1);
	}	
}

// Starting message
console.log('College House Management Application starting up..');

// The PORT that the web server will run on.
var PORT = 8080;

// Options for webdriver.
var webdriverOpts = {
	desiredCapabilities: {
		browserName: 'chrome',
		chromeOptions: {
			// Try to use the default profile
			args: ['--user-data-dir="' + chromeUserDirectory + '"']
		}
	}
};

// Set up Express to handle HTTP requests
// Static will ensure any requests for files go to the file system.
app.use(express.static('www'));

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

		// Log in with username/password
		login(client, channel, channelLookup);
	});

	res.status(200).end();
});

// Exit the application
app.get('/exit', function(req, res) {
	res.status(200).end();

	console.log('Closing open windows and deleting cookies..');
	client.getTabIds(function(err,response) {
		if(response) {
			var allTabs = response.slice(0);

			// Close all tabs
			for(var i = 1; i<allTabs.length; i++) {
				this.switchTab(allTabs[i]).deleteCookie().close();
			}	
		}
	});

	console.log('Closing browser..');
	client.end().then(function() {
		console.log('Closing selenium-standalone..');
		seleniumStandaloneProcess.kill('SIGINT');	
	});

	setTimeout(function() {
		console.log('Exiting application..');
		process.exit(0);
	}, 7000);
});

// Start the selenium-standalone as a child process
console.log('Starting selenium-standalone server..');
var seleniumStandaloneProcess = spawn('selenium-standalone', ['start']);

// Run the HTTP server
setTimeout(function() {
	console.log('Starting http server..');
	server = app.listen(PORT, function () {
		var host = server.address().address;
		var port = server.address().port;

		console.log('College House Management Application running on http://localhost:%s', port);

	  	// Initialize the WebDriver client.
	  	client = webdriverio.remote(webdriverOpts).init();

	  	// Now open a new web browser and go to the management page.
		client.url('http://localhost:' + PORT);
	});
}, 7000);