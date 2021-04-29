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

app.listen(port, () => {
	console.log(`Pixel-Drop listening on port ${port}`);
});

app.get('/', (req, res) => {
	res.render('index');
});

app.post('/SVG', (req, res) => {
	const svgElm = req.body.svgElm;
	let svgPath = 'public/img/test.svg';
	const makeSvg = async () => {
		try {
			const svgFile = await writeSvgElmToFile(svgElm);
			res.send('Test svg Saved');
		} catch (err) {
			console.log(err);
		}
	};
	console.log(path.join(__dirname, svgPath));
	makeSvg();
});

app.get('/tiletest', (req, res) => {
	res.render('tileTest');
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
