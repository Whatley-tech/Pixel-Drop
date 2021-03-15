const Pixel = class {
	constructor(color, x, y, size) {
		this.color = color;
		this.size = size;
		this.xOrigin = x;
		this.yOrigin = y;
		this.xEnd = this.xOrigin + this.size;
		this.yEnd = this.yOrigin + this.size;
	}
};

class Canvas {
	constructor(rows, cols) {
		this.rows = rows;
		this.cols = cols;
		this.scale = window.devicePixelRatio;
		this.container = document.querySelector('#canvasContainer');
		this.canvasElement = null;
		this.ctx = null;
		this.currentIndex = 0;
		this.isDrawing = false;
		this.pixels = [[]];
		this.pixelsLastIndex = () => this.pixels.length - 1;
		this.brushSize = 1;
		this.canvasLeft = null;
		this.canvasTop = null;
		this.pixelSize = null;
		this.canvasWidth = null;
		this.canvasHeight = null;
		this.xBrushPosition = null;
		this.yBrushPosition = null;

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
				this.drawCanvas();
			}
		};

		this.redo = function () {
			if (this.currentIndex < this.pixelsLastIndex()) {
				this.currentIndex++;
				this.drawCanvas();
			}
		};

		this.createCanvasElement = function () {
			const canvasElement = document.createElement('canvas');
			const ctx = canvasElement.getContext('2d');
			canvasElement.id = 'canvas';
			this.findPixelSize();
			this.updateBrushSize();
			this.canvasWidth = this.cols * this.pixelSize;
			this.canvasHeight = this.rows * this.pixelSize;
			canvasElement.style.width = `${this.canvasWidth}px`;
			canvasElement.style.height = `${this.canvasHeight}px`;
			canvasElement.width = Math.floor(this.cols * this.pixelSize * this.scale);
			canvasElement.height = Math.floor(
				this.rows * this.pixelSize * this.scale
			);
			canvasElement.classList.add('canvas');
			canvasContainer.appendChild(canvasElement);
			this.canvasElement = canvasElement;
			this.ctx = ctx;
			this.canvasLeft =
				this.canvasElement.offsetLeft + this.canvasElement.clientLeft;
			this.canvasTop =
				this.canvasElement.offsetTop + this.canvasElement.clientTop;
			ctx.scale(this.scale, this.scale);
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
			this.drawCanvas();

			this.canvasElement.addEventListener('mousemove', (e) =>
				this.updateBrushPosition(e)
			);

			this.canvasElement.addEventListener('click', (e) => this.paintPixel(e));
			this.canvasElement.addEventListener('mousedown', (e) => {
				this.saveState();
				this.isDrawing = true;
				this.paintPixel(e);
			});
			this.canvasElement.addEventListener('mousemove', (e) => {
				if (this.isDrawing) this.paintPixel(e);
			});
			this.canvasElement.addEventListener('mouseup', (e) => {
				this.isDrawing = false;
			});
		};
		this.drawBrushPosition = function () {
			this.ctx.strokeStyle = 'green';
			this.ctx.strokeRect(
				this.xBrushPosition - this.brushSize / 2,
				this.yBrushPosition - this.brushSize / 2,
				this.brushSize,
				this.brushSize
			);
		};
		this.updateBrushSize = function (value = 1) {
			this.brushSize = Math.floor((this.pixelSize / 2) * value);
		};
		this.drawCanvas = function (pixels = this.pixels[this.currentIndex]) {
			for (let pixel of pixels) {
				this.ctx.fillStyle = pixel.color;
				this.ctx.fillRect(pixel.xOrigin, pixel.yOrigin, pixel.size, pixel.size);
			}
			this.drawBrushPosition();
		};
		this.updateBrushPosition = function (evt) {
			this.xBrushPosition = evt.pageX - this.canvasLeft;
			this.yBrushPosition = evt.pageY - this.canvasTop;
			this.drawCanvas();
		};
		this.paintPixel = function () {
			let x = this.xBrushPosition;
			let y = this.yBrushPosition;
			let pixels = this.pixels[this.pixelsLastIndex()];
			let brushOffSet = this.brushSize / 2;

			let q1x = x + brushOffSet;
			let q1y = y - brushOffSet;
			let q2x = x - brushOffSet;
			let q2y = y - brushOffSet;
			let q3x = x - brushOffSet;
			let q3y = y + brushOffSet;
			let q4x = x + brushOffSet;
			let q4y = y + brushOffSet;
			let quadrants = [
				[q1x, q1y],
				[q2x, q2y],
				[q3x, q3y],
				[q4x, q4y],
			];

			pixels.forEach((pixel) => {
				for (let quadrant of quadrants) {
					if (
						quadrant[0] >= pixel.xOrigin &&
						quadrant[0] <= pixel.xEnd &&
						quadrant[1] >= pixel.yOrigin &&
						quadrant[1] <= pixel.yEnd
					) {
						pixel.color = pallet.currentColor;
						this.drawCanvas();
					}
				}
			});
		};
	}
}
