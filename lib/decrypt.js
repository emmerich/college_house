var crypto = require('crypto');
var MASTER_PASSWORD = process.env.MASTER_PASSWORD;

module.exports = function(text) {
	var decipher = crypto.createDecipher('aes-256-ctr', MASTER_PASSWORD);
	var dec = decipher.update(text, 'hex', 'utf8');
	dec += decipher.final('utf8');
	return dec;
};