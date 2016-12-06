var fs = require('fs');

var express = require('express');
var app     = express();

app.set('port', (process.env.PORT || 5000));

//For avoidong Heroku $PORT error
app.get('/', function(request, response) {
    var result = 'App is running'
    response.send(result);
}).listen(app.get('port'), function() {
    console.log('App is running, server is listening on port ', app.get('port'));
});

//Ping the app every 5 minutes to prevent sleeping
var http = require('http');
setInterval(function () {
	http.get("http://saajanbot.herokuapp.com");
}, 300000);


//Get bot version
var v = require('./version.json');
//console.log(version);
var version = v.version;

//Check to see if Discord is loaded properly
try {

	var Discord = require('discord.js');

} catch (e) {

	console.log(e.stack);
	console.log(process.version);
	console.log('Please run npm install and ensure it passes with no errors!');
	process.exit();
}

console.log("Starting SaajanBot\nNode version: " + process.version + "\nDiscord.js version: " + Discord.version);

//Cleverbot plugin loading
try {

	var clever = require('./plugins/Cleverbot/cleverbot');
	var Clever = new clever();

} catch (e) {

	console.log('Couldn\'t load cleverbot plugin\n' + e.stack);
}

//Load YouTube plugin
try {

	var youtube = require('./plugins/YouTube/youtube');
	var YouTubePlugin = new youtube();

} catch (e) {

	console.log('Couldn\'t load youtube plugin\n' + e.stack);
}

//Load speech plugin
try {

	var speech = require('./plugins/Speak/speak');
	var Speech = new speech();

} catch (e) {

	console.log('Couldn\'t load speech plugin');
}

//Load Giphy plugin
try {

	var giphy = require('./plugins/Giphy/giphy');
	var GiphyPlugin = new giphy();

} catch (e) {

	console.log('Couldn\'t load giphy plugin\n' + e.stack);
}

//Load Urbandictionary plugin
try {

	var dictionary = require('./plugins/Urban/urban');
	var Urban = new dictionary();

} catch (e) {

	console.log('Couldn\'t load urban dictionary plugin\n' + e.stack);
}

//Load the insult plugin
try {

	var insult = require('./plugins/Insults/insults');
	var Insult = new insult();

} catch (e) {

	console.log('Couldn\'t load insult plugin\n' + e.stack);
}

//Load the LMGTFY plugin

try {

	var lmgtfy = require('./plugins/LMGTFY/lmgtfy');
	var LMGTFY = new lmgtfy();

} catch (e) {

	console.log('Couldn\'t load the LMGTFY plugin');
}

//Load 8ball plugin
try {

	var eightBall = require('./plugins/8Ball/8ball');
	var EightBall = new eightBall();

} catch (e) {

	console.log("Could not load 8ball plugin" + e.stack);
}

//Load the Meme plugin
try {

	var meme = require('./plugins/Meme/meme');
	var Meme = new meme();

} catch (e) {

	console.log('Couldn\'t load the meme plugin');

}

//Load Danbooru plugin
try {

	var danbooru = require('./plugins/Danbooru/danbooru');
	var Danbooru = new danbooru();

} catch (e) {

	console.log('Couldn\'t load the danbooru plugin');
}

//Load NSFW plugin
try {

	var nsfw = require('./plugins/NSFW/nsfw');
	var NSFW = new nsfw();

} catch (e) {

	console.log('Couldn\'t load the nsfw plugin');

}

//Load OPGG plugin
try {

	var opgg = require('./plugins/OPGG/opgg');
	var OPGG = new opgg();

} catch (e) {

	console.log('Couldn\'t load the opgg plugin');

}

//Load Pokemon plugin
try {

	var pokemon = require('./plugins/Pokemon/pokemon');
	var Pokemon = new pokemon();

} catch (e) {

	console.log('Couldn\'t load the Pokemon plugin');

}

//Load Weather plugin
try {

	var weather = require('./plugins/Weather/weather');
	var Weather = new weather();

} catch (e) {

	console.log('Couldn\'t load the weather plugin');

}

//Load Trivia Plugin
try {

	var trivia = require('./plugins/Trivia/trivia');
	var Trivia = new trivia();

} catch (e) {

	console.log('Couldn\'t load the trivia plugin');

}

//Load authentication creds
try {

	var Auth = require('./authenticate.json');

} catch (e) {

	console.log('Please create an authentication file with a bot token or email/password.\n' + e.stack);
	process.exit();
}

var highCommands = ['eval', 'die'];
var Permissions = {};


//Load permissions
try {

	Permissions = require('./permissions.json');
} catch (e) {

	Permissions.global = {};
	Permissions.users = {};
}

for (var i = 0; i < highCommands.length; i++) {

	var cmd = highCommands[i];

	if(!Permissions.global.hasOwnProperty(cmd)) {

		Permissions.global[cmd] = false;
	}
}


//Check to see if permissions exist for the user
Permissions.checkPermission = function (user, permission) {
	try {

		var allowed = true;
		try {
			if (Permissions.global.hasOwnProperty(permission)) {
			allowed = Permissions.global[permission] === true;
		}

		} catch (e) {}

		try {

			if(Permissions.users[user.id].hasOwnProperty(permission)) {
				allowed = Permissions.users[user.id][permission] === true;
			}
		} catch (e) {}
		return allowed;

	} catch (e) {}
	return false;

};

fs.writeFile("./permissions.json", JSON.stringify(Permissions, null, 2));

var Config = {};

try {

	Config = require("./config.json");
} catch (e) {

	Config.debug = false;
	Config.commandPrefix = "!";

	try {

		if(fs.lstatSync("./config.json").isFile()) {
			console.log("WARNING: config.json file found but we couldn't read it\n" + e.stack);
		}
	} catch (e2) {
		fs.writeFile("./config.json", JSON.stringify(Config, null, 2));
	}
}

if(!Config.hasOwnProperty("commandPrefix")) {
	Config.commandPrefix = "!";
}

//Create bot instance
var bot = new Discord.Client();

var commands = {
	"gif" : {
		usage: "<query>",
		description: "Returns a gif matching your tag (i.e searching for Charmander will find a Charmander gif)",
		process: function (bot, message, suffix) {
			GiphyPlugin.send(suffix, message.channel, bot);
		}
	},
	"youtube" : {
		usage: "<query>",
		description: "Shows a random youtube video matching your search query",
		process: function (bot, message, suffix) {
			YouTubePlugin.respond(suffix, message.channel, bot);
		}
	},
	"urban" : {
		usage: "<query>",
		description: "Returns an urban dictionary definition based on your search query",
		process: function (bot, message, suffix) {
			Urban.define(suffix, message.channel, bot);
		}
	},
	"insult" : {
		usage: "",
		description: "Gets a fancy insult",
		process: function (bot, message, suffix) {
			Insult.sendInsult(suffix, message.channel, bot);
		}
	},
	"cb" : {
		usage: "<message>",
		description: "Talk to Cleverbot",
		process: function (bot, message, suffix) {
			Clever.talk(suffix, message.channel, bot);
		}
	},
	"jason" : {
		usage: "",
		description: "Tell Jason to fuck off",
		process: function (bot, message, suffix) {
			message.channel.sendMessage("Fuck off Jason");
		}
	},
	"8ball" : {
		usage: "<question>",
		description: "Ask the 8ball a question",
		process: function (bot, message, suffix) {
			EightBall.ask(suffix, message.channel, message.author, bot);
		}
	},
	"speak" : {
		usage: "<message>",
		description: "Make the bot send a TTS message",
		process: function (bot, message, suffix) {
			Speech.say(suffix, message.channel, bot);
		}
	},
	"randurban" : {
		usage: "",
		description: "Get a random urbandictionary definition",
		process: function (bot, message) {
			Urban.randomDef(message.channel, bot);
		}
	},
	"lmgtfy" : {
		usage : "<query>",
		description: "Sends a lmgtfy link based on your search query",
		process: function (bot, message, suffix) {
			LMGTFY.sendLink(suffix, message.channel, bot);
		}
	},
	"meme" : {
		usage: "[meme type] (i.e Insanity wolf)",
		description: "Gets a meme based on your meme type",
		process: function (bot, message, suffix) {
			Meme.getMeme(suffix, message.channel, bot);
		}
	},
	"madeby" : {
		usage: "",
		description: "Names the bot creator",
		process: function (bot, message, suffix) {
			message.channel.sendMessage("I was made by " + bot.users.get('182243917322780673'));
		}
	},
	"die" : {
		description: "Kills the bot. Must have 'die' permission",
		process: function (bot, message, suffix) {
			if(Permissions.checkPermission(message.author, "die")) {
				message.channel.sendMessage("I am going offline. Goodbye :frowning2:");
				setTimeout(function () {
					process.on('SIGTERM', app.close());
					process.exit(1);
				}, 300);

			} else {
				message.channel.sendMessage("You do not have permissions to execute that command, " + message.author);
			}
		}
	},
	"db" : {
		usage: "<tags>",
		description: "Gets an image from Danbooru based on your tags",
		process: function (bot, message, suffix) {
			Danbooru.getImage(suffix, message.channel, bot);
		}
	},
	"nsfw" : {
		usage: "<query>",
		description: "Gets an NSFW image based on your search query",
		process: function (bot, message, suffix) {
			NSFW.getNsfw(suffix, message.channel, bot);
		}
	},
	"opgg" : {
		usage: "<summoner name>",
		description: "Gets a users op.gg profile based on your search",
		process: function (bot, message, suffix) {
			OPGG.getProfile(suffix, message.channel, bot);
		}
	},
	"weather" : {
		usage: "<city, province>",
		description: "Gets the weather for the city/state based on your search (i.e Toronto ON)",
		process: function (bot, message, suffix) {
			Weather.getWeather(suffix, message.channel, bot);
		}
	},
	"lgtrivia" : {
		usage: "<start, end, next or answer>",
		description: "Starts a game of league trivia",
		process: function (bot, message, suffix) {
			Trivia.getQuestion(suffix, message.channel, bot);
		}
	}
};


function checkForCommand (message, isEdit) {

	if (message.author.id != bot.user.id && (message.content[0] === Config.commandPrefix)) {
		var cmdText = message.content.split(' ')[0].substring(1);
		var suffix = message.content.substring(cmdText.length+2);
		//console.log(suffix);
		if(message.isMentioned(bot.user)) {
			try {
				cmdText = message.content.split(' ')[1];
				suffix = message.content.substring(bot.user.mention().length+cmdText.length+1);
			} catch (e) {
				message.channel.sendMessage("%?");
				return;
			}
		}
		var cmd = commands[cmdText];

		if(cmdText === "help") {
			if(suffix) {
				var cmds = suffix.split(' ').filter(function(cmd){return commands[cmd]});
				var info = "";

				for (var i = 0; i < cmds.length; i++) {
					var com = cmds[i];
					info += "**" + Config.commandPrefix + com+"**";
					var usage = commands[com].usage;

					if (usage) {
						info += " " + usage;
					}

					var description = commands[com].description;

					if(description instanceof Function) {
						description = description();
					}

					if(description) {
						info += "\n\t" + description;
					}

					info += "\n";
				}
				message.channel.sendMessage(info);
			} else {
				message.author.sendMessage("**Available Commands**").then(function () {
					var batch = "";
					var sortedComs = Object.keys(commands).sort();

					for (var i in sortedComs) {
						var command = sortedComs[i];
						var info = "**" + Config.commandPrefix + command + "**";
						var usage = commands[command].usage;

						if(usage) {
							info += " " + usage;
						}

						var description = commands[command].description;

						if(description instanceof Function) {
							description = description();
						}

						if(description) {
							info += "\n\t" + description;
						}

						var newBatch = batch + "\n" + info;

						if(newBatch.length > (1024 - 8)) {
							message.author.sendMessage(batch);
							batch = info;
						} else {
							batch = newBatch;
						}
					}
					if(batch.length > 0) {
						message.author.sendMessage(batch);
					}
				});
			}
	} else if (cmd) {
		if(Permissions.checkPermission(message.author, cmdText)) {
			try {
				cmd.process(bot, message, suffix, isEdit);
			} catch (e) {
				var messageText = "Command " + cmdText + " failed ¯\\_(ツ)_/¯";
				if(Config.debug) {
					messageText += "\n" + e.stack;
				}
				message.channel.sendMessage(messageText);
			}
		} else {
			message.channel.sendMessage("Authorization failed. You do not have permission to run: " + cmdText);
		}
	} else {
		if(message.author == bot.user) {
			return;
		}

		if(message.author != bot.user && message.isMentioned(bot.user)) {
			message.channel.sendMessage(message.author + " , %?");
		}
	}
}
}

//When a message is sent, check to see if there's a command
bot.on('message', (message) => checkForCommand(message, false));
bot.on('messageUpdate', (oldMessage, newMessage) => {

	checkForCommand(newMessage, true);
});

//When the bot comes online, set it's user status
bot.on('ready', function () {
	require('./plugins.js').init();
	var v = require('./version.json');
	var version = v.version;
	var updateMsg = v.updateMessage;
	bot.user.setStatus("online", "Version "+version);

	fs.readFile('./version.json', 'utf8', function (err, data) {
		if(err) {
			return console.log(err);
		}


		var result = data.updateMessage;
		result = "";

		fs.writeFile('./version.json', result, 'utf8', function (err) {
			if(err) {
				return console.log(err);
			}
		});
	});
	bot.channels.get('235879002227736588').sendMessage(updateMsg + version + '\n\nType !help to view my commands');
});

bot.on('disconnect', function () {
	bot.channels.get('235879002227736588').sendMessage('Goodbye :frowning2:');
})

exports.addCommand = function (commandName, commandObject) {
	try {
		commands[commandName] = commandObject;
	} catch (error) {
		console.log(error);
	}
}

exports.commandCount = function () {
	return Object.keys(commands).length;
}
//Check if authentication details exist and login the bot
if (Auth.bot_token) {
	bot.login(Auth.bot_token);
} else {
	console.log("Could not connect");
}
