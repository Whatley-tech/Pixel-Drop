const Canvas = class {
	constructor(rows, cols) {
		this.rows = rows;
		this.cols = cols;
		this.scale = window.devicePixelRatio;
		this.container = document.querySelector('#canvasContainer');
		this.canvasElement = null;
		this.ctx = null;
		this.pixels = [[]];
		this.currentIndex = 0;
		this.isDrawing = false;

		this.saveState = function () {
			if (this.currentIndex !== this.pixels.length - 1) {
				this.pixels.splice(this.currentIndex + 1);
			}
			let copyState = _.cloneDeep(_.last(this.pixels));
			this.pixels.push(copyState);
			this.currentIndex = this.pixels.length - 1;
			console.log(this);
		};

		this.undo = function () {
			if (this.currentIndex > 0) {
				this.currentIndex--;
				this.drawCanvas();
			}
		};

		this.redo = function () {
			if (this.currentIndex < this.pixels.length - 1) {
				this.currentIndex++;
				this.drawCanvas();
			}
		};

		this.createCanvasElement = function () {
			const canvasElement = document.createElement('canvas');
			const ctx = canvasElement.getContext('2d');
			canvasElement.id = 'canvas';
			const canvasWidth = this.cols * this.pixelSize();
			const canvasHeight = this.rows * this.pixelSize();
			canvasElement.style.width = `${canvasWidth}px`;
			canvasElement.style.height = `${canvasHeight}px`;
			canvasElement.width = Math.floor(
				this.cols * this.pixelSize() * this.scale
			);
			canvasElement.height = Math.floor(
				this.rows * this.pixelSize() * this.scale
			);
			canvasElement.classList.add('canvas');
			canvasContainer.appendChild(canvasElement);
			this.canvasElement = canvasElement;
			this.ctx = ctx;
			ctx.scale(this.scale, this.scale);
		};

		this.pixelSize = function () {
			const containerWidth = this.container.scrollWidth;
			const containerHeight = this.container.scrollHeight;
			const colSize = Math.floor(containerWidth / this.cols);
			const rowSize = Math.floor(containerHeight / this.rows);
			const pixelSize =
				colSize > rowSize || colSize === rowSize ? rowSize : colSize;
			return pixelSize;
		};

		this.initGrid = function () {
			const lightGray = 'rgb(215, 215, 215)';
			const darkGray = 'rgb(250, 250, 250)';
			const rows = this.rows;
			const cols = this.cols;
			const pixelSize = this.pixelSize();
			let fillColor = lightGray;
			let row = 0;
			console.log(pallet.currentColor);

			for (let y = 0; y < rows * pixelSize; y += pixelSize) {
				row % 2 === 0 ? (fillColor = darkGray) : (fillColor = lightGray);
				row++;
				for (let x = 0; x < cols * pixelSize; x += pixelSize) {
					fillColor === lightGray
						? (fillColor = darkGray)
						: (fillColor = lightGray);

					let pixel = new Pixel(this.ctx, fillColor, x, y, this.pixelSize());
					this.pixels[0].push(pixel);
				}
			}
			this.currentIndex = this.pixels.length - 1;
			this.drawCanvas();

			this.canvasElement.addEventListener('click', (e) => this.paintPixel(e));
			this.canvasElement.addEventListener('mousedown', (e) => {
				console.log(pallet.currentColor);
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

		this.drawCanvas = function (pixels = this.pixels[this.currentIndex]) {
			for (let pixel of pixels) {
				this.ctx.fillStyle = pixel.color;
				this.ctx.fillRect(pixel.xOrigin, pixel.yOrigin, pixel.size, pixel.size);
			}
		};

		this.paintPixel = function (evt) {
			const canvasLeft =
				this.canvasElement.offsetLeft + this.canvasElement.clientLeft;
			const canvasTop =
				this.canvasElement.offsetTop + this.canvasElement.clientTop;
			let x = evt.pageX - canvasLeft;
			let y = evt.pageY - canvasTop;
			let pixels = this.pixels[this.pixels.length - 1];

			pixels.forEach((pixel) => {
				if (
					x >= pixel.xOrigin &&
					x <= pixel.xEnd &&
					y >= pixel.yOrigin &&
					y <= pixel.yEnd
				) {
					pixel.color = pallet.currentColor;
					this.drawCanvas();
				}
			});
		};
	}
};

const Pixel = class {
	constructor(ctx, color, x, y, size) {
		this.color = color;
		this.size = size;
		this.xOrigin = x;
		this.yOrigin = y;
		this.xEnd = this.xOrigin + this.size;
		this.yEnd = this.yOrigin + this.size;
	}
};
