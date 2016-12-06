var request = require('request');
const token = '5e29e24fafef9476275a4f01ac066e74';
function Weather () {};

Weather.prototype.getWeather = function (input, channel, bot) {
	var weatherIn = input.split(' ').join(',');
	request('http://api.openweathermap.org/data/2.5/weather?q='+weatherIn + '&units=metric' + '&appid=' +token, function (err, res, body) {
		if(!err && res.statusCode == 200) {
			var forecast = JSON.parse(body);
			var sunrise = forecast.sys.sunrise;
			var sunset = forecast.sys.sunset;
			sunriseDate = new Date(sunrise*1000);
			sunsetDate = new Date(sunset*1000);
			channel.sendMessage('Location: ' + forecast.name + '\n' + 'Conditions: ' + forecast.weather[0].description + '\nTemperature: ' + forecast.main.temp + 'C' + '\n' + 'Visibility: ' + forecast.visibility + '\n' + 'Clouds: ' + forecast.clouds.all + '\n' + 'Sunrise: ' + sunriseDate + '\n' + 'Sunset: ' + sunsetDate);
		} else {
			channel.sendMessage("¯\\_(ツ)_/¯");
		}
	});
};

module.exports = Weather;