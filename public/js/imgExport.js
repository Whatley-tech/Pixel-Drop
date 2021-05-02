const exportImage = function (type, scaleValue) {
	const svg = createSVG(scaleValue);

	if (type == 'svg') {
		let newTab = window.open();
		newTab.document.body.appendChild(svg);
	}
	if (type == 'png') {
		let newTab = window.open();
		const dpr = window.devicePixelRatio,
			h = stage.height * scaleValue,
			w = stage.width * scaleValue,
			c = document.createElement('canvas'),
			ctx = c.getContext('2d');

		c.width = w * dpr;
		c.height = h * dpr;
		ctx.scale(dpr, dpr);
		drawSVGtoCanvas(svg, ctx, () => {
			let png = canvasToPNG(c, w, h);
			newTab.document.body.append(png);
		});
	}
};

const createSVG = function (scaleValue = 1) {
	if (scaleValue < 1) return console.error('scale value less than 1');
	const newW = stage.width * scaleValue,
		newH = stage.height * scaleValue,
		ratio = newW / stage.width,
		pixelCollection = getPixelData(),
		svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

	svg.setAttribute('width', `${newW}`);
	svg.setAttribute('height', `${newH}`);
	// svg.setAttribute('viewbox', `0 0 ${newW} ${newH}`);
	svg.setAttributeNS(
		'http://www.w3.org/2000/xmlns/',
		'xmlns:xlink',
		'http://www.w3.org/1999/xlink'
	);

	//create a rect element for each pixel
	for (let y = 0; y < stage.height; y++) {
		for (let x = 0; x < stage.width; x++) {
			let pointer = y * stage.width + x,
				pixel = pixelCollection.pixels[pointer],
				color = UintToRGB(pixel),
				rect = makeSVGRect(x * ratio, y * ratio, ratio, ratio, color);

			svg.appendChild(rect);
		}
	}

	return svg;
};

const makeSVGRect = function (x, y, width, height, color) {
	let rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
	rect.setAttribute('x', x);
	rect.setAttribute('y', y);
	rect.setAttribute('width', width);
	rect.setAttribute('height', height);
	rect.setAttribute('fill', color);
	rect.setAttribute('shape-rendering', 'crispEdges');
	return rect;
};

const canvasToPNG = function (canvas, width, height) {
	let pngImg = new Image(width, height);
	pngImg.src = canvas.toDataURL();
	return pngImg;
};

const drawSVGtoCanvas = function (svgElement, ctx, callback) {
	const svgURL = new XMLSerializer().serializeToString(svgElement);
	const img = new Image();
	img.onload = function () {
		ctx.drawImage(this, 0, 0);
		callback();
	};
	img.src = 'data:image/svg+xml; charset=utf8, ' + encodeURIComponent(svgURL);
};

const getPixelData = function () {
	let pixelCollection = {
		imgHeight: stage.height,
		imgWidth: stage.width,
		pixels: [],
	};

	for (let y = 0; y < stage.height; y++) {
		for (let x = 0; x < stage.width; x++) {
			let pixel = stage.mergedView.ctx.getImageData(x, y, 1, 1).data;
			pixelCollection.pixels.push(pixel);
		}
	}
	return pixelCollection;
};

const UintToRGB = function (array) {
	const color = `rgb(${array[0]},${array[1]},${array[2]},${array[3]})`;
	return color;
};
