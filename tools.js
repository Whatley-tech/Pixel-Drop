class Tool {
	constructor(buttonElement) {
		this.buttonElement = buttonElement;
		this.size = 1;
		this.undoAble = true;
		this.isDrawing = false;
		this.pixelBuffer = [];
		this.halfPixel = 0.5;
		this.xPosition = 0;
		this.yPosition = 0;
		this.xPixelPosition = undefined;
		this.yPixelPosition = undefined;
		this.xPixelOrigin = undefined;
		this.yPixelOrigin = undefined;
	}
	get offset() {
		return Math.floor((stage.pixelSize * this.size) / 2);
	}
	get ctx() {
		return stage.activeLayer.ctx;
	}
	get canvas() {
		return stage.activeLayer;
	}
	get brushSize() {
		return this.size * stage.pixelSize;
	}
	updatePosition(evt) {
		let canvas = stage.brushOverlay;
		//find brushPosition
		this.xPosition = Math.floor(evt.pageX - stage.leftOrigin);
		this.yPosition = Math.floor(evt.pageY - stage.topOrigin);
		this.xPixelPosition = Math.floor(this.xPosition / stage.pixelSize);
		this.yPixelPosition = Math.floor(this.yPosition / stage.pixelSize);
		this.xPixelOrigin = this.xPixelPosition * stage.pixelSize;
		this.yPixelOrigin = this.yPixelPosition * stage.pixelSize;
		//draw brushPosition outline
		canvas.ctx.clearRect(0, 0, stage.styleWidth, stage.styleHeight);
		canvas.ctx.fillStyle = 'rgb(130, 130, 130, 0.5)';
		canvas.ctx.fillRect(
			this.xPixelOrigin,
			this.yPixelOrigin,
			this.brushSize,
			this.brushSize
		);
	}
	bufferPixels(x, y, color, size) {
		if (size == 1) return this.pixelBuffer.push(new Pixel(x, y, color, size));

		for (let i = 0; i < size; i++) {
			let originY = y + i;

			for (let j = 0; j < size; j++) {
				let originX = x + j;
				this.pixelBuffer.push(new Pixel(originY, originX, color, 1));
			}
		}
	}
	storePixels() {
		// this.breakUpPixels();
		this.removeDuplicates();
		// const newPixels = _.differenceWith(
		// 	this.pixelBuffer,
		// 	this.canvas.pixels,
		// 	_.isEqual
		// );
		_.each(this.pixelBuffer, (newPixel) => {
			_.remove(this.canvas.pixels, (pixel) => {
				return pixel.x == newPixel.x && pixel.y == newPixel.y;
			});
		});

		if (this.pixelBuffer) this.canvas.pixels.push(...this.pixelBuffer);
		this.clearBuffer();
	}
	removeDuplicates() {
		_.each(this.pixelBuffer, (pixel) => {
			_.remove(this.pixelBuffer, (p) => {
				return _.isEqual(pixel, p) && pixel !== p;
			});
		});
	}
	// breakUpPixels() {
	// 	_.each(this.pixelBuffer, (pixel) => {
	// 		if (pixel.size == 1) return;

	// 		for (let i = 0; i < pixel.size; i++) {
	// 			let originY = pixel.y + i;

	// 			for (let j = 0; j < pixel.size; j++) {
	// 				let originX = pixel.x + j;
	// 				this.pixelBuffer.push(new Pixel(originY, originX, pixel.color, 1));
	// 			}
	// 		}
	// 		_.remove(this.pixelBuffer, pixel);
	// 	});
	// }
	clearBuffer() {
		_.remove(this.pixelBuffer);
	}
}

class Brush extends Tool {
	startAction() {}
	action() {
		this.drawPixel();
	}
	releaseAction() {
		this.storePixels();
	}
	drawPixel(
		x = this.xPixelPosition,
		y = this.yPixelPosition,
		color = colorPanel.currentColor,
		size = this.brushSize,
		buffer = true
	) {
		if (buffer) this.bufferPixels(x, y, color, this.size);
		this.ctx.fillStyle = color;
		this.ctx.fillRect(x * stage.pixelSize, y * stage.pixelSize, size, size);
	}
	drawCheckerGrid(canvas) {
		const lightGray = '#d7d7d7';
		const darkGray = '#fafafa';
		const rows = stage.rows;
		const cols = stage.cols;
		let currentColor = undefined;
		let colorOffset = 0;

		stage.clearCanvas(stage.background);
		for (let x = 0; x < cols; x++) {
			colorOffset % 2 === 0
				? (currentColor = darkGray)
				: (currentColor = lightGray);
			colorOffset++;
			for (let y = 0; y < rows; y++) {
				currentColor === lightGray
					? (currentColor = darkGray)
					: (currentColor = lightGray);

				canvas.ctx.fillStyle = currentColor;
				canvas.ctx.fillRect(
					x * stage.pixelSize,
					y * stage.pixelSize,
					1 * stage.pixelSize,
					1 * stage.pixelSize
				);
			}
		}
	}
}
class Eraser extends Tool {
	startAction() {}
	action() {
		this.erasePixel();
	}
	releaseAction() {}
	erasePixel(x = this.xPixelPosition, y = this.yPixelPosition) {
		this.bufferPixels(x, y);
		this.ctx.clearRect(x, y, this.brushSize, this.brushSize);
	}
}
class EyeDrop extends Tool {
	constructor(buttonElement) {
		super(buttonElement);
		this.color = undefined;
		this.undoAble = false;
	}
	startAction() {
		stage.setMergedView();
	}
	action() {
		this.color = this.selectColor();
		console.log(this.color);
	}
	releaseAction() {
		//do nothing if pixel was transparent
		stage.clearCanvas(stage.mergedView);
		colorPanel.setColor();
		if (this.color) return colorPanel.updateColorHistory(this.color);
	}
	selectColor(x = this.xPosition, y = this.yPosition) {
		//multiply x/y to account for context scale
		let colorSample = stage.mergedView.ctx.getImageData(
			x * stage.dpr,
			y * stage.dpr,
			1,
			1
		).data;

		//if colorSample has full transparency do nothing
		if (colorSample[3] != 0) {
			let hex = colorPanel.rgbToHex(...colorSample);
			colorPanel.selectNewColor(hex);
			return hex;
		}
	}
}
class FillTool extends Tool {
	startAction() {}
	action() {}
	releaseAction() {
		// this.fill();
		this.colorReplace();
	}
	getColorSample(x = this.xPosition, y = this.yPosition) {
		return this.ctx.getImageData(x * stage.dpr, y * stage.dpr, 1, 1).data;
	}
	checkPixelColor(xPixelPosition, yPixelPosition) {
		return this.ctx.getImageData(
			xPixelPosition * stage.pixelSize * stage.dpr + this.offset, // +1 for rounding error??
			yPixelPosition * stage.pixelSize * stage.dpr + this.offset,
			1,
			1
		).data;
	}
	colorReplace(x = this.xPosition, y = this.yPosition) {
		const sample = this.getColorSample();
		for (let i = 0; i < stage.cols; i++) {
			for (let j = 0; j < stage.rows; j++) {
				let checkPixel = this.checkPixelColor(i, j);
				if (sample.join() == checkPixel.join()) {
					this.ctx.fillStyle = colorPanel.currentColor;
					this.ctx.fillRect(
						i * stage.pixelSize,
						j * stage.pixelSize,
						stage.pixelSize + 0.5,
						stage.pixelSize + 0.5
					);
				}
			}
		}
	}
}
class MoveTool extends Tool {
	constructor(buttonElement) {
		super(buttonElement);
		this.xMoveStart = undefined;
		this.yMoveStart = undefined;
		this.startImg = undefined;
	}

	startAction() {
		this.xMoveStart = this.xPixelPosition;
		this.yMoveStart = this.yPixelPosition;
		this.startImg = stage.copyImage(this);
	}
	action() {
		this.moveCanvas();
	}
	releaseAction() {}
	moveCanvas(xpp = this.xPixelPosition, ypp = this.yPixelPosition) {
		const xDistance = this.checkMoveDistance(this.xMoveStart, xpp);
		const yDistance = this.checkMoveDistance(this.yMoveStart, ypp);
		stage.clearCanvas(this);
		this.ctx.putImageData(
			this.startImg,
			xDistance * stage.dpr,
			yDistance * stage.dpr
		);
	}
	checkMoveDistance(startPosition, currentPosition) {
		return (currentPosition - startPosition) * stage.pixelSize;
	}
}
