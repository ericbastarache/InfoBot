var urbanDictionary = require('urban');

function UrbanDictionary () {
	
};

UrbanDictionary.prototype.define = function (input, channel, bot) {
	this.urban = urbanDictionary(input);
	this.urban.first(function (json) {
		if (json) {
			channel.sendMessage("Word: " + json.word + "\nDefinition: " + json.definition + "\nExample: " + "\n\n" + json.permalink);
		} else {
			channel.sendMessage("¯\\_(ツ)_/¯");
		}
		
	});
};

UrbanDictionary.prototype.randomDef = function (channel, bot) {
	this.urban = urbanDictionary.random();
	this.urban.first(function (json) {
		if(json) {
			channel.sendMessage("Word: " + json.word + "\nDefinition: " + json.definition + "\nExample " + json.example + "\n\n" + json.permalink);
		} else {
			channel.sendMessage("¯\\_(ツ)_/¯");
		}
	});
};

module.exports = UrbanDictionary;