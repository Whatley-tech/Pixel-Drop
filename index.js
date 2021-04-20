const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const { convertFile } = require('convert-svg-to-png');
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
			const svgFile = await writeSvgElmToFile(svgElm);
			const stats = await getFileStats(svgPath);
			console.log(`SVG size was ${stats.size}bytes...`);
			const outputFilePath = await convertFile(svgPath);
			console.log(outputFilePath);
			res.send('finished');
		} catch (err) {
			console.log(err);
		}
	};
	makePng();
	// console.log('here before done!');
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
