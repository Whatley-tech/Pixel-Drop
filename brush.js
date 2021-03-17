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

		this.updatePosition = function (evt) {
			this.xPosition = Math.floor(evt.pageX - brushCanvas.leftOrigin);
			this.yPosition = Math.floor(evt.pageY - brushCanvas.topOrigin);
			this.xPixelPosition = Math.floor(this.xPosition / pixelCanvas.pixelSize);
			this.yPixelPosition = Math.floor(this.yPosition / pixelCanvas.pixelSize);
			brushCanvas.drawBrushPosition();
		};

		this.updateSize = function (value = 1) {
			this.size = value;
			this.offset = Math.floor(pixelCanvas.pixelSize / 2);
		};
	}
}
