var request = require('request');
function EightBall () {

};

EightBall.prototype.ask = function (input, channel, author, bot) {
	
	request('https://8ball.delegator.com/magic/JSON/' + input, function (error, response, body) {
		if(!error && response.statusCode == 200) {
			var ball = JSON.parse(body);
			channel.sendMessage(ball.magic.answer + " " + author);
		} else {
			console.log("Got an error: " + response.statusCode);
		}
	});
}

module.exports = EightBall;