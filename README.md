# College House Management Application

## Setup
* Install Nodejs
* Clone the repository
* Run ./install.sh
* Create a configuration file (see below)
* Run ./run.sh

## Configuration File
The only thing missing from the repository is a configuration file. Create a configuration file in the root direction and name is `configuration.json`. Here is a template:
```javascript
{
	"channels": {
		"Example Channel": {
			"url": "https://mail.google.com",
			"username": "myusername",
			"password": "mypassword"
		}
	}
}
```