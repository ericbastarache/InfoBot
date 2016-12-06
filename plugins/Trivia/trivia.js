var fs = require('fs');
var request = require('request');
var prompt = require('./leaguetrivia.json');
var jsonfile = require('jsonfile');
var file = './plugins/Trivia/testtrivia.json';

function Trivia () {};

Trivia.prototype.getQuestion = function (input, channel, bot) {
	jsonfile.readFile(file, function (err, obj) {
		if(err) {
			console.log(err);
		} else {
			var rand_val = obj.leagueQuestions.questions[Math.floor(Math.random()*obj.leagueQuestions.questions.length)];
			
		}
	});
};

module.exports = Trivia;