var util = require('util');
var youtube_node = require('youtube-node');
var Auth = require("../../authenticate.json");


function YouTubePlugin () {
	this.youtube = new youtube_node();
	this.youtube.setKey(Auth.youtube_key);
};

YouTubePlugin.prototype.respond = function (query, channel, bot) {
	this.youtube.search(query, 20, function (error, result) {
		if(error) {
			channel.sendMessage("¯\\_(ツ)_/¯");
		} else {
			if(!result || !result.items || result.items.length < 1) {
				channel.sendMessage("¯\\_(ツ)_/¯");
			} else {
				channel.sendMessage("http://www.youtube.com/watch?v=" + result.items[Math.floor(Math.random()*20)].id.videoId);
			}
		}
	});
};

module.exports = YouTubePlugin;