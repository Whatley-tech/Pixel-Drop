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
	get brushSize() {
		this.size * stage.pixelSize;
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
		this.xPixelOrigin = this.xPixelPosition * stage.pixelSize;
		this.yPixelOrigin = this.yPixelPosition * stage.pixelSize;
		//draw brushPosition outline
		canvas.ctx.clearRect(0, 0, stage.width, stage.height);
		canvas.ctx.fillStyle = 'rgb(130, 130, 130, 0.5)';
		console.log(this.xPosition, this.yPosition);
		canvas.ctx.fillRect(
			this.xPosition,
			this.yPosition,
			this.brushSize,
			this.brushSize
		);
		// canvas.ctx.fillRect(
		// 	this.xPixelOrigin,
		// 	this.yPixelOrigin,
		// 	this.brushSize,
		// 	this.brushSize
		// );
		this.render(canvas);
	}
	render(canvas = stage.activeLayer) {
		// console.log(canvas);
		stage.mainCanvas.ctx.drawImage(canvas.element, 0, 0);
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

		stage.clearCanvas(canvas);
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
		this.render(canvas);
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
		for (let i = 0; i < stage.width; i++) {
			for (let j = 0; j < stage.height; j++) {
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
