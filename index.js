const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
var bodyParser = require('body-parser');
const { stringify } = require('querystring');
const port = 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
	res.render('index');
});
app.use(bodyParser.json());
app.post('/PNG', (req, res) => {
	// const { data } = req.body;
	console.log(req.body);

	// fs.open('public/img/test.svg', 'w+', (err, fd) => {
	// 	if (err) {
	// 		console.log(err);
	// 		return;
	// 	}
	// });
});

app.listen(port, () => {
	console.log(`Pixel-Drop listening on port ${port}`);
});
