var request = require('request');

function Meme () {};

Meme.prototype.getMeme = function (input, channel, bot) {
	var memeIn = input.split(' ').join('-');
	request('http://version1.api.memegenerator.net/Instances_Select_ByPopular?languageCode=en&pageSize=24&urlName='+memeIn, function (err, response, body) {
		if(!err && response.statusCode == 200) {
			var meme = JSON.parse(body);
			channel.sendMessage(meme.result[Math.floor(Math.random()*12)].instanceImageUrl);
		} else {
			console.log(err);
			channel.sendMessage("¯\\_(ツ)_/¯");
		}
	});
}

module.exports = Meme;