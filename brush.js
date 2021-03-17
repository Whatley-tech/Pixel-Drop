class Brush {
	constructor(size) {
		this.size = pixelCanvas.pixelSize;
		this.offset = this.size / 2;
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
			this.xTopLeft = this.xPosition - this.offset;
			this.yTopLeft = this.yPosition - this.offset;
			this.xBottomRight = this.xPosition + this.offset;
			this.yBottomRight = this.yPosition + this.offset;
			// console.log('brush position', this.xTopLeft, this.yTopLeft);
			brushCanvas.drawBrushPosition();
		};

		this.updateSize = function (value = 1) {
			this.size = Math.floor(pixelCanvas.pixelSize * value);
			this.offset = this.size / 2;
		};

		this.paintPixel = function () {
			let pixels = pixelCanvas.pixels[pixelCanvas.pixelsLastIndex()];
			console.log(pixels);

			pixels.forEach((pixel) => {
				if (
					pixel.color != pallet.currentColor &&
					pixel.xCenter >= brush.xTopLeft &&
					pixel.xCenter <= brush.xBottomRight &&
					pixel.yCenter >= brush.yTopLeft &&
					pixel.yCenter <= brush.yBottomRight
				)
					pixel.color = pallet.currentColor;
				pixelCanvas.drawPixel(pixel);
			});
			// if (!this.isDrawing) pixelCanvas.drawAllPixels();
		};
	}
}
