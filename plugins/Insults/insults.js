var request = require('request');

function Insults () {

};

Insults.prototype.sendInsult = function (input, channel, bot) {
	request("http://quandyfactory.com/insult/json/" + input, function (error, response, body) {
		if(!error && response.statusCode == 200) {
			var yourInsult = JSON.parse(body);
			channel.sendMessage(yourInsult.insult);
		} else {
			console.log("Got an error");
		}
	});
};

module.exports = Insults;