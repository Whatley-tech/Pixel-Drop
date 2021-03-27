class Tool {
	constructor(buttonElement) {
		this.size = 1;
		this.xPosition = 0;
		this.yPosition = 0;
		this.isDrawing = false;
		this.buttonElement = buttonElement;
	}
	get offset() {
		return Math.floor(stage.pixelSize / 2);
	}
	get ctx() {
		return stage.activeLayer.ctx;
	}
	updatePosition(evt) {
		let canvas = stage.brushOverlay;
		//find brushPosition
		this.xPosition = Math.floor(evt.pageX - stage.leftOrigin);
		this.yPosition = Math.floor(evt.pageY - stage.topOrigin);
		// console.log(this.xPosition);
		this.xPixelPosition = Math.floor(this.xPosition / stage.pixelSize);
		this.yPixelPosition = Math.floor(this.yPosition / stage.pixelSize);
		//draw brushPosition
		canvas.ctx.clearRect(0, 0, stage.width, stage.height);
		canvas.ctx.strokeStyle = 'green';
		canvas.ctx.strokeRect(
			this.xPosition - this.offset,
			this.yPosition - this.offset,
			this.size * stage.pixelSize,
			this.size * stage.pixelSize
		);
	}
}

class Brush extends Tool {
	startAction() {}
	action() {
		this.drawPixel();
	}
	releaseAction() {}
	drawPixel(x = this.xPixelPosition, y = this.yPixelPosition) {
		let xOrigin = x * stage.pixelSize;
		let yOrigin = y * stage.pixelSize;

		this.ctx.fillStyle = colorPanel.currentColor;
		this.ctx.fillRect(
			xOrigin,
			yOrigin,
			stage.pixelSize * this.size,
			stage.pixelSize * this.size
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
				this.drawPixel(x, y);
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
		let xOrigin = x * stage.pixelSize;
		let yOrigin = y * stage.pixelSize;

		// this.ctx.fillStyle = colorPanel.currentColor;
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
	}
	startAction() {}
	action() {
		this.color = this.selectColor();
		console.log(this.color);
	}
	releaseAction() {
		//do nothing if pixel was transparent
		if (this.color) return colorPanel.updateColorHistory(this.color);
	}
	selectColor(x = this.xPosition, y = this.yPosition) {
		//multiply x/y to account for context scale
		let colorSample = this.ctx.getImageData(
			x * stage.scale,
			y * stage.scale,
			1,
			1
		).data;

		//if colorSample has full transparency do nothing
		if (colorSample[3] != 0) {
			let hex = colorPanel.rgbToHex(...colorSample);
			colorPanel.setCurrentColor(hex);
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
		return this.ctx.getImageData(x * stage.scale, y * stage.scale, 1, 1).data;
	}
	checkPixelColor(xPixelPosition, yPixelPosition) {
		return this.ctx.getImageData(
			xPixelPosition * stage.pixelSize * stage.scale + this.offset, // +1 for rounding error??
			yPixelPosition * stage.pixelSize * stage.scale + this.offset,
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
						stage.pixelSize,
						stage.pixelSize
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
		this.startImg = this.captureLayerImg();
		// console.log(this.xMoveStart, this.yMoveStart);
	}
	action() {
		this.moveCanvas();
	}
	releaseAction() {}
	moveCanvas(xpp = this.xPixelPosition, ypp = this.yPixelPosition) {
		const xDistance = this.checkMoveDistance(this.xMoveStart, xpp);
		const yDistance = this.checkMoveDistance(this.yMoveStart, ypp);
		console.log(xDistance, yDistance);
		this.ctx.clearRect(0, 0, stage.width, stage.height);
		this.ctx.putImageData(
			this.startImg,
			xDistance * stage.scale,
			yDistance * stage.scale
		);
	}
	checkMoveDistance(startPosition, currentPosition) {
		return (currentPosition - startPosition) * stage.pixelSize;
	}
	captureLayerImg() {
		let img = this.ctx.getImageData(
			0,
			0,
			stage.scaledWidth,
			stage.scaledHeight
		);
		return img;
	}
}
