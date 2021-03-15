class Brush {
	constructor(size) {
		this.size = canvas.pixelSize;
		this.offset = this.size / 2;
		this.xPosition = 0;
		this.yPosition = 0;
		this.xTopLeft = 0;
		this.yTopLeft = 0;
		this.xBottomRight = 0;
		this.yBottomRight = 0;
		this.isDrawing = false;

		this.updatePosition = function (evt) {
			this.xPosition = evt.pageX - canvas.leftOrigin;
			this.yPosition = evt.pageY - canvas.topOrigin;
			this.xTopLeft = this.xPosition - this.offset;
			this.yTopLeft = this.yPosition - this.offset;
			this.xBottomRight = this.xPosition + this.offset;
			this.yBottomRight = this.yPosition + this.offset;
			canvas.draw();
		};

		this.updateSize = function (value = 1) {
			this.size = Math.floor(canvas.pixelSize * value);
			this.offset = this.size / 2;
		};

		this.paintPixel = function () {
			let pixels = canvas.pixels[canvas.pixelsLastIndex()];
			pixels.forEach((pixel) => {
				if (
					pixel.xCenter >= brush.xTopLeft &&
					pixel.xCenter <= brush.xBottomRight &&
					pixel.yCenter >= brush.yTopLeft &&
					pixel.yCenter <= brush.yBottomRight
				)
					pixel.color = pallet.currentColor;
				// canvas.draw();
			});
		};
	}
}
