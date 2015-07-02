# College House Management Application

## Setup
* Install Nodejs
* Clone the repository
* Run npm install
* Run selenium-standalone install
* Create a configuration file (see below)
* Run ./run.sh MASTER_PASSWORD

## Encrypting a password
Passwords are encrypted using a master password. Use the following utility to
encrypt a password:
```
./password.sh MASTER_PASSWORD PASSWORD_TO_ENCRYPT
```
This will output an encrypted password which you can then drop in the configuration file. Make sure to use the same master password as you use when you run the application.

## Configuration File
The only thing missing from the repository is a configuration file. Create a configuration file in the root direction and name is `configuration.json`. Here is a template:
```javascript
{
	"channels": {
		"Example Channel": {
			"url": "https://mail.google.com",
			"username": "username",
			"password": "encrypted_password"
		}
	}
}
```