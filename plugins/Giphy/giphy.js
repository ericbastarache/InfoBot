var giphy = require('giphy-api')();

function Giphy () {};

Giphy.prototype.send = function (input, channel, bot) {
	giphy.search(input, function (err, res) {
		if(err) {
			channel.sendMessage("¯\\_(ツ)_/¯");
			console.log(err);
		} else {
			channel.sendMessage(res.data[Math.floor(Math.random()*25)].url);
		}

	});
}

module.exports = Giphy;