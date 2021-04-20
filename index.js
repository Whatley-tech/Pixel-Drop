const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const { stringify } = require('querystring');
const port = 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json({ limit: 50000000 }));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
	res.render('index');
});
app.use(bodyParser.json());
app.post('/PNG', (req, res) => {
	const svgElm = req.body.svgElm;
	let svgPath = 'public/img/test.svg';

	const makePng = async () => {
		try {
			let svgFile = await writeSvgElmToFile(svgElm);
			let svg = await fs.promises.open(svgPath);
			let stats = await svg.stat();
			res.send('finished');
			console.log(stats);
		} catch (err) {
			console.log(err);
		}
	};
	makePng();
	console.log('here before done!');

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

const writeSvgElmToFile = async (svgElm) => {
	return await fs.promises.writeFile('public/img/test.svg', svgElm);
};
