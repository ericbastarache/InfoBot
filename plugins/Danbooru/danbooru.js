var danbooru = require('danbooru');

function Danbooru () {};

Danbooru.prototype.getImage = function (input, channel, bot) {
	danbooru.get('posts', {limit: 50, tags: input}, function (err, data) {
		if(err) {
			console.log(err);
			channel.sendMessage("¯\\_(ツ)_/¯");
		} else {
			console.log(data);
		}
	});
};

module.exports = Danbooru;