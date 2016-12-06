function LMGTFY () {};

LMGTFY.prototype.sendLink = function (input, channel, bot) {
	var filteredLmgtfy = input.split(' ').join('+');
	var url = "http://lmgtfy.com/?q=";
	url += filteredLmgtfy;
	channel.sendMessage(url);
}

module.exports = LMGTFY;