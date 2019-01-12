var express = require('express');
var bodyParser = require('body-parser');
var { search, url } = require('./163music/api');

var app = express();

app.use(express.static('src/server/home')).listen(8080);
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.post('/search', function(request, response) {
	search(request.body.keywords, (res) => {
		response.send(res);
	});
});
app.post('/url', function(request, response) {
	url(request.body.url, (res) => {
		response.send(res);
	});
});
