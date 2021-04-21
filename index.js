const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const { stringify } = require('querystring');
const base64Img = require('base64-img');
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
			const svgFile = await writeSvgElmToFile(svgElm);
			const stats = await getFileStats(svgPath);
			console.log(`SVG size was ${stats.size}bytes...`);
			base64Img.base64(svgPath, function (err, data) {
				const img64 = data;
				console.log(img64);
				res.send(img64);
			});
		} catch (err) {
			console.log(err);
		}
	};
	makePng();
	// console.log('here before done!');
});
app.post('/SVG', (req, res) => {
	const svgElm = req.body.svgElm;
	let svgPath = 'public/img/test.svg';
	const makeSvg = async () => {
		try {
			const svgFile = await writeSvgElmToFile(svgElm);
			res.sendFile(path.join(__dirname, 'public/img/test.svg'), (err) =>
				console.log(err)
			);
		} catch (err) {
			console.log(err);
		}
	};
	makeSvg();
});

app.listen(port, () => {
	console.log(`Pixel-Drop listening on port ${port}`);
});

const writeSvgElmToFile = async (svgElm) => {
	return await fs.promises.writeFile('public/img/test.svg', svgElm);
};
const getFileStats = async (path) => {
	const file = await fs.promises.open(path);
	const stats = await file.stat();
	file.close();
	return stats;
};
