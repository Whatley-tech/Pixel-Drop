class Tool {
	constructor(buttonElement) {
		this.buttonElement = buttonElement;
		this.size = 1;
		this.undoAble = true;
		this.isDrawing = false;
		this.xPosition = 0;
		this.yPosition = 0;
		this.xPixelPosition = 0;
		this.yPixelPosition = 0;
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
		this.xPixelPosition = Math.floor(this.xPosition / stage.pixelSize);
		this.yPixelPosition = Math.floor(this.yPosition / stage.pixelSize);

		//draw brushPosition outline
		canvas.ctx.clearRect(0, 0, stage.width, stage.height);
		canvas.ctx.fillStyle = 'rgb(130, 130, 130, 0.5)';
		canvas.ctx.fillRect(
			this.xPixelPosition,
			this.yPixelPosition,
			this.size,
			this.size
		);
	}
}
class Brush extends Tool {
	startAction() {
		this.drawPixel();
	}
	action() {
		this.drawPixel();
	}
	releaseAction() {}
	drawPixel(
		x = this.xPixelPosition,
		y = this.yPixelPosition,
		color = colorPanel.currentColor,
		size = this.size,
		buffer = true
	) {
		this.ctx.fillStyle = color;
		this.ctx.fillRect(x, y, size, size);
	}
	drawCheckerGrid(canvas) {
		const lightGray = '#d7d7d7';
		const darkGray = '#fafafa';
		const height = stage.height;
		const width = stage.width;
		let currentColor = undefined;
		let colorOffset = 0;

		for (let x = 0; x < width; x++) {
			colorOffset % 2 === 0
				? (currentColor = darkGray)
				: (currentColor = lightGray);
			colorOffset++;
			for (let y = 0; y < height; y++) {
				currentColor === lightGray
					? (currentColor = darkGray)
					: (currentColor = lightGray);

				canvas.ctx.fillStyle = currentColor;
				canvas.ctx.fillRect(x, y, 1, 1);
			}
		}
	}
}
class Eraser extends Tool {
	startAction() {
		this.erasePixel();
	}
	action() {
		this.erasePixel();
	}
	releaseAction() {}
	erasePixel(x = this.xPixelPosition, y = this.yPixelPosition) {
		this.ctx.clearRect(x, y, this.size, this.size);
	}
}
class EyeDrop extends Tool {
	constructor(buttonElement) {
		super(buttonElement);
		this.color = undefined;
		this.undoAble = false;
		this.imgData = [];
	}
	startAction() {
		stage.setMergedView();
		this.imgData = stage.mergedView.ctx.getImageData();
	}
	action() {
		this.color = this.selectColor();
	}
	releaseAction() {
		//do nothing if pixel was transparent
		stage.mergedView.clearCanvas();
		colorPanel.setColor();
		if (this.color) return colorPanel.updateColorHistory(this.color);
	}
	selectColor(x = this.xPixelPosition, y = this.yPixelPosition) {
		let colorSample = stage.mergedView.ctx.getImageData(x, y, 1, 1).data;
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
	getColorSample(x = this.xPixelPosition, y = this.yPixelPosition) {
		return this.ctx.getImageData(x, y, 1, 1).data;
	}
	checkPixelColor(xPixelPosition, yPixelPosition) {
		return this.ctx.getImageData(
			xPixelPosition, // +1 for rounding error??
			yPixelPosition,
			1,
			1
		).data;
	}
	colorReplace(x = this.xPosition, y = this.yPosition) {
		const sample = this.getColorSample();
		for (let i = 0; i < stage.width; i++) {
			for (let j = 0; j < stage.height; j++) {
				let checkPixel = this.checkPixelColor(i, j);
				if (sample.join() == checkPixel.join()) {
					this.ctx.fillStyle = colorPanel.currentColor;
					this.ctx.fillRect(i, j, 1, 1);
				}
			}
		}
	}
}
class MoveTool extends Tool {
	constructor(buttonElement) {
		super(buttonElement);
		this.xMoveStart = 0;
		this.yMoveStart = 0;
		this.startImg = {};
	}
	startAction() {
		this.xMoveStart = this.xPixelPosition;
		this.yMoveStart = this.yPixelPosition;
		this.startImg = this.canvas.img;
	}
	action() {
		this.moveCanvas();
	}
	releaseAction() {}
	moveCanvas(xpp = this.xPixelPosition, ypp = this.yPixelPosition) {
		const xDistance = this.checkMoveDistance(this.xMoveStart, xpp);
		const yDistance = this.checkMoveDistance(this.yMoveStart, ypp);
		if (xDistance == 0 && yDistance == 0) return;
		this.canvas.clearCanvas();
		this.canvas.ctx.drawImage(this.startImg, xDistance, yDistance);
	}
	checkMoveDistance(startPosition, currentPosition) {
		return Math.floor(currentPosition - startPosition);
	}
}
