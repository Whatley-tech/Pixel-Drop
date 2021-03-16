const Pixel = class {
	constructor(color, x, y, size) {
		this.color = color;
		this.size = size;
		this.xOrigin = x;
		this.yOrigin = y;
		this.xEnd = this.xOrigin + this.size;
		this.yEnd = this.yOrigin + this.size;
		this.xCenter = x + size / 2;
		this.yCenter = y + size / 2;
	}
};

class Canvas {
	constructor(rows, cols) {
		this.rows = rows;
		this.cols = cols;
		this.scale = window.devicePixelRatio;
		this.container = document.querySelector('#canvasContainer');
		this.element = null;
		this.ctx = null;
		this.currentIndex = 0;
		this.pixels = [[]];
		this.pixelSize = null;
		this.canvasWidth = null;
		this.canvasHeight = null;

		this.pixelsLastIndex = () => this.pixels.length - 1;

		this.saveState = function () {
			//delete redos
			if (this.currentIndex !== this.pixelsLastIndex()) {
				this.pixels.splice(this.currentIndex + 1);
			}
			let copyState = _.cloneDeep(_.last(this.pixels));
			this.pixels.push(copyState);
			this.currentIndex = this.pixelsLastIndex();
		};

		this.undo = function () {
			if (this.currentIndex > 0) {
				this.currentIndex--;
				this.draw();
			}
		};

		this.redo = function () {
			if (this.currentIndex < this.pixelsLastIndex()) {
				this.currentIndex++;
				this.draw();
			}
		};

		this.createCanvasElement = function () {
			this.element = document.createElement('canvas');
			this.ctx = this.element.getContext('2d');
			this.findPixelSize();
			// this.updateBrushSize();
			this.canvasWidth = this.cols * this.pixelSize;
			this.canvasHeight = this.rows * this.pixelSize;
			this.element.id = 'canvas';
			this.element.style.width = `${this.canvasWidth}px`;
			this.element.style.height = `${this.canvasHeight}px`;
			this.element.width = Math.floor(this.cols * this.pixelSize * this.scale);
			this.element.height = Math.floor(this.rows * this.pixelSize * this.scale);
			this.element.classList.add('canvas');
			canvasContainer.appendChild(this.element);
			this.leftOrigin = this.element.offsetLeft + this.element.clientLeft;
			this.topOrigin = this.element.offsetTop + this.element.clientTop;
			this.ctx.scale(this.scale, this.scale);
		};

		this.findPixelSize = function () {
			const containerWidth = this.container.scrollWidth;
			const containerHeight = this.container.scrollHeight;
			const colSize = Math.floor(containerWidth / this.cols);
			const rowSize = Math.floor(containerHeight / this.rows);
			const pixelSize =
				colSize > rowSize || colSize === rowSize ? rowSize : colSize;
			this.pixelSize = pixelSize;
		};

		this.initGrid = function () {
			const lightGray = 'rgb(215, 215, 215)';
			const darkGray = 'rgb(250, 250, 250)';
			const rows = this.rows;
			const cols = this.cols;
			const pixelSize = this.pixelSize;
			let fillColor = lightGray;
			let row = 0;

			for (let y = 0; y < rows * pixelSize; y += pixelSize) {
				row % 2 === 0 ? (fillColor = darkGray) : (fillColor = lightGray);
				row++;
				for (let x = 0; x < cols * pixelSize; x += pixelSize) {
					fillColor === lightGray
						? (fillColor = darkGray)
						: (fillColor = lightGray);

					let pixel = new Pixel(fillColor, x, y, this.pixelSize);
					this.pixels[0].push(pixel);
				}
			}

			this.currentIndex = this.pixelsLastIndex();
			this.draw();
		};

		this.drawBrushPosition = function () {
			this.ctx.strokeStyle = 'green';
			this.ctx.strokeRect(
				brush.xPosition - brush.offset,
				brush.yPosition - brush.offset,
				brush.size,
				brush.size
			);
		};

		this.drawCanvas = function (pixels) {
			for (let pixel of pixels) {
				this.ctx.fillStyle = pixel.color;
				this.ctx.fillRect(pixel.xOrigin, pixel.yOrigin, pixel.size, pixel.size);
			}
		};
		this.draw = function (pixels = this.pixels[this.currentIndex]) {
			this.drawCanvas(pixels);
			this.drawBrushPosition();
		};
	}
}
