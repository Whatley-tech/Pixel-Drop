class Brush {
	constructor(size) {
		this.size = 1;
		this.offset = 0;
		this.xPosition = 0;
		this.yPosition = 0;
		this.xTopLeft = 0;
		this.yTopLeft = 0;
		this.xBottomRight = 0;
		this.yBottomRight = 0;
		this.isDrawing = false;
	}
	updatePosition(evt) {
		let canvas = brushOverlay;
		//find brushPosition
		this.xPosition = Math.floor(evt.pageX - brushOverlay.leftOrigin);
		this.yPosition = Math.floor(evt.pageY - brushOverlay.topOrigin);
		this.xPixelPosition = Math.floor(this.xPosition / pixelCanvas.pixelSize);
		this.yPixelPosition = Math.floor(this.yPosition / pixelCanvas.pixelSize);
		//draw brushPosition
		canvas.ctx.clearRect(0, 0, canvas.width, canvas.height);
		canvas.ctx.strokeStyle = 'green';
		canvas.ctx.strokeRect(
			this.xPosition - this.offset,
			this.yPosition - this.offset,
			this.size * canvas.pixelSize,
			this.size * canvas.pixelSize
		);
	}

	updateSize(value = 1) {
		this.size = value;
		this.offset = Math.floor(pixelCanvas.pixelSize / 2);
	}
}
