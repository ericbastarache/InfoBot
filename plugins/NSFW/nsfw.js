var parseString = require('xml2js').parseString;
var https = require('https');

function NSFW () {};

NSFW.prototype.getNsfw = function (input, channel, bot) {
	channel.sendMessage('Work in progress');
};

module.exports = NSFW;