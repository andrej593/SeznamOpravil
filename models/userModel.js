var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var userSchema = new Schema({
	'username' : String,
	'name' : String,
	'lastname' : String,
	'email' : String,
	'password' : String
});


module.exports = mongoose.model('user', userSchema);
