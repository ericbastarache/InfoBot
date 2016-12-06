var request = require('request');
function OPGG () {};

OPGG.prototype.getProfile = function (input, channel, bot) {
	var summonerProfile = input.split(' ').join('+');

	request('http://na.op.gg/summoner/userName=' + summonerProfile, function (error, res) {
		if(!error && res.statusCode == 200) {
			channel.sendMessage('http://na.op.gg/summoner/userName='+summonerProfile);
		} else {
			channel.sendMessage("¯\\_(ツ)_/¯");
			console.log("Got an error: " + res.statusCode);
		}
	});
};

module.exports = OPGG;