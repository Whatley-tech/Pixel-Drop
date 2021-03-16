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
		this.stage = document.querySelector('#stage');
		this.canvasContainer = document.querySelector('#canvasContainer');
		this.element = null;
		this.ctx = null;
		this.currentIndex = 0;
		this.pixels = [[]];
		this.pixelSize = null;
		this.width = null;
		this.height = null;
		this.topOrigin = null;
		this.leftOrigin = null;

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

		this.createCanvasElement = function (id) {
			this.element = document.createElement('canvas');
			this.ctx = this.element.getContext('2d');
			this.findPixelSize();
			// this.updateBrushSize();
			this.width = this.cols * this.pixelSize;
			this.height = this.rows * this.pixelSize;
			this.element.id = id;
			this.element.style.width = `${this.width}px`;
			this.element.style.height = `${this.height}px`;
			this.element.width = Math.floor(this.cols * this.pixelSize * this.scale);
			this.element.height = Math.floor(this.rows * this.pixelSize * this.scale);
			this.element.classList.add('canvas', id);
			this.ctx.scale(this.scale, this.scale);
		};
		this.appendCanvasElement = function () {
			this.stage.appendChild(this.element);
			let box = this.element.getBoundingClientRect();
			this.leftOrigin = box.left;
			this.topOrigin = box.top;
		};

		this.findPixelSize = function () {
			const containerWidth = this.canvasContainer.scrollWidth;
			const containerHeight = this.canvasContainer.scrollHeight;
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
			this.drawGrid();
		};

		this.drawBrushPosition = function () {
			// console.log(brush.xPosition, brush.yPosition);
			this.ctx.clearRect(0, 0, this.width, this.height);
			this.ctx.strokeStyle = 'green';
			this.ctx.strokeRect(
				brush.xPosition - brush.offset,
				brush.yPosition - brush.offset,
				brush.size,
				brush.size
			);
		};

		this.drawGrid = function (pixels = this.pixels[this.currentIndex]) {
			for (let pixel of pixels) {
				this.ctx.fillStyle = pixel.color;
				this.ctx.fillRect(pixel.xOrigin, pixel.yOrigin, pixel.size, pixel.size);
			}
		};
		// this.draw = function (pixels = this.pixels[this.currentIndex]) {
		// 	this.drawCanvas(pixels);
		// 	this.drawBrushPosition();
		// };
	}
}
