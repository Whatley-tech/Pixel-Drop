class Tool {
	constructor(buttonElement) {
		this.size = 1;
		this.xPosition = 0;
		this.yPosition = 0;
		this.isDrawing = false;
		this.pixelBuffer = [];
		this.buttonElement = buttonElement;
		this.undoAble = true;
		this.halfPixel = 0.5;
		this.xPixelPosition = undefined;
		this.yPixelPosition = undefined;
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
	updatePosition(evt) {
		let canvas = stage.brushOverlay;
		//find brushPosition
		this.xPosition = Math.floor(evt.pageX - stage.leftOrigin);
		this.yPosition = Math.floor(evt.pageY - stage.topOrigin);
		// console.log(this.xPosition);
		this.xPixelPosition =
			Math.floor(this.xPosition / stage.pixelSize) + this.halfPixel;
		this.yPixelPosition =
			Math.floor(this.yPosition / stage.pixelSize) + this.halfPixel;
		//draw brushPosition outline
		canvas.ctx.clearRect(0, 0, stage.styleWidth, stage.styleHeight);
		canvas.ctx.strokeStyle = 'green';
		canvas.ctx.strokeRect(
			this.xPosition - this.offset,
			this.yPosition - this.offset,
			this.size * stage.pixelSize,
			this.size * stage.pixelSize
		);
		canvas.ctx.strokeStyle = 'purple';
		canvas.ctx.strokeRect(this.xPosition, this.yPosition, 10, 10);
	}
	bufferPixels(x, y, color, size) {
		this.pixelBuffer.push(new Pixel(x, y, color, size));
	}
	storePixels() {
		this.removeDuplicates();
		const newPixels = _.differenceWith(
			this.pixelBuffer,
			this.canvas.pixels,
			_.isEqual
		);
		if (newPixels) this.canvas.pixels.push(...newPixels);
		this.clearBuffer();
	}
	removeDuplicates() {
		_.each(this.pixelBuffer, (pixel) => {
			_.remove(this.pixelBuffer, (p) => {
				return _.isEqual(pixel, p) && pixel !== p;
			});
		});
	}
	clearBuffer() {
		_.remove(this.pixelBuffer);
	}
}

class Brush extends Tool {
	startAction() {}
	action() {
		this.drawPixel();
	}
<<<<<<< HEAD
	releaseAction() {
		this.storePixels();
	}
	drawPixel(
		x = this.xPixelPosition,
		y = this.yPixelPosition,
		color = colorPanel.currentColor,
		size = this.size
	) {
		let xOrigin = x * stage.pixelSize;
		let yOrigin = y * stage.pixelSize;

		this.bufferPixels(x, y, color, size);
		this.ctx.fillStyle = color;
		this.ctx.fillRect(
			xOrigin,
			yOrigin,
			stage.pixelSize * size,
			stage.pixelSize * size
=======
	releaseAction() {}
	drawPixel(x = this.xPixelPosition, y = this.yPixelPosition) {
		if (this.size % 2 == 0) {
			x -= this.halfPixel;
			y -= this.halfPixel;
		}

		let xOrigin = x * stage.pixelSize;
		let yOrigin = y * stage.pixelSize;

		this.ctx.fillStyle = colorPanel.currentColor;

		this.ctx.fillRect(
			xOrigin - this.offset,
			yOrigin - this.offset,
			stage.pixelSize * this.size,
			stage.pixelSize * this.size
>>>>>>> 58546bd46a2abad21dcb2a6f3b83063fc635de37
		);
	}
	drawCheckerGrid() {
		const lightGray = '#d7d7d7';
		const darkGray = '#fafafa';
		const rows = stage.rows;
		const cols = stage.cols;
		let colorOffset = 0;

		for (let x = 0; x < cols; x++) {
			colorOffset % 2 === 0
				? (colorPanel.currentColor = darkGray)
				: (colorPanel.currentColor = lightGray);
			colorOffset++;
			for (let y = 0; y < rows; y++) {
				colorPanel.currentColor === lightGray
					? (colorPanel.currentColor = darkGray)
					: (colorPanel.currentColor = lightGray);

				this.ctx.fillStyle = colorPanel.currentColor;
				this.ctx.fillRect(
					x * stage.pixelSize,
					y * stage.pixelSize,
					stage.pixelSize * this.size,
					stage.pixelSize * this.size
				);
			}
		}
		this.storePixels();
	}
}
class Eraser extends Tool {
	startAction() {}
	action() {
		this.erasePixel();
	}
	releaseAction() {}
	erasePixel(x = this.xPixelPosition, y = this.yPixelPosition) {
		let xOrigin = x * stage.pixelSize;
		let yOrigin = y * stage.pixelSize;

		this.bufferPixels(x, y);
		this.ctx.clearRect(
			xOrigin,
			yOrigin,
			stage.pixelSize * this.size,
			stage.pixelSize * this.size
		);
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
