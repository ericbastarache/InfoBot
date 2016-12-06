var cleverbot = require('cleverbot.io');
var cBot = new cleverbot('iVf0XjfJRRCj09Ht', 'aBtgVlbA3KoBacPtr4uC5k73a2SexujM');
var cleverSession = cBot.setNick("saajanbot");

function Cleverbot() {};

Cleverbot.prototype.talk = function (input, channel, bot) {
	cBot.create(function (err, cleverSession) {
		if(err) {
			console.log("An error occurred!");
			channel.sendMessage("¯\\_(ツ)_/¯");
		} else {
			cBot.ask(input, function (err, response) {
				if(err) {
					console.log(err);
					channel.sendMessage("¯\\_(ツ)_/¯");
				} else {
					channel.sendMessage(response);
				}
			});
		}
	});
}

module.exports = Cleverbot;