

function Speak () {};

Speak.prototype.say = function (input, channel, bot) {
	channel.sendTTSMessage(input);
}

module.exports = Speak;