var crypto = require('crypto');
var MASTER_PASSWORD = process.env.MASTER_PASSWORD;
var password = process.argv[2];

// Perform the encryption
var cipher = crypto.createCipher('aes-256-ctr', MASTER_PASSWORD);
var encrypted = cipher.update(password, 'utf8', 'hex') + cipher.final('hex');

console.log(encrypted);