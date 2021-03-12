const Canvas = class {
	constructor(rows, cols) {
		this.rows = rows;
		this.cols = cols;
		this.scale = window.devicePixelRatio;
		this.container = document.querySelector('#canvasContainer');
		this.canvasElement = null;
		this.ctx = null;
		this.pixels = [];
		this.undoStates = [];
		this.redoStates = [];

		this.saveState = function () {
			this.undoStates = [_.cloneDeep(this.pixels)];
			// console.log(`This is undoState ${this.pixels}`);
			// console.log(`this is pixelstate ${this.pixels}`);
		};
		this.undo = function () {
			this.redoStates = [_.cloneDeep(this.pixels)];
			this.pixels = _.takeRight(this.undoStates);
			this.drawCanvas();
			console.log(this.pixels);
			console.log(this.undoStates);
		};
		this.drawCanvas = function () {
			let pixels = this.pixels;
			for (let pixel of pixels) {
				pixel.draw();
			}
			this.saveState();
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
			// ctx.translate(-1, -1);
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

		this.initilizeGrid = function () {
			const lightGray = 'rgb(215, 215, 215)';
			const darkGray = 'rgb(250, 250, 250)';
			const rows = this.rows;
			const cols = this.cols;
			const pixelSize = this.pixelSize();
			let fillColor = lightGray;
			let row = 0;

			for (let y = 0; y < rows * pixelSize; y += pixelSize) {
				row % 2 === 0 ? (fillColor = darkGray) : (fillColor = lightGray);
				row++;
				for (let x = 0; x < cols * pixelSize; x += pixelSize) {
					fillColor === lightGray
						? (fillColor = darkGray)
						: (fillColor = lightGray);

					let pixel = new Pixel(this.ctx, fillColor, x, y, this.pixelSize());
					this.pixels.push(pixel);
					// pixel.draw();
				}
			}
			this.drawCanvas();
			this.canvasElement.addEventListener('click', (e) => this.paintPixel(e));
		};

		this.paintPixel = function (evt) {
			const elmLeft =
				this.canvasElement.offsetLeft + this.canvasElement.clientLeft;
			const elmTop =
				this.canvasElement.offsetTop + this.canvasElement.clientTop;
			let x = evt.pageX - elmLeft;
			let y = evt.pageY - elmTop;

			this.pixels.forEach((pixel) => {
				if (
					x >= pixel.xOrigin &&
					x <= pixel.xEnd &&
					y >= pixel.yOrigin &&
					y <= pixel.yEnd
				) {
					pixel.color = currentColor;
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
		this.changeColor = (color) => (this.color = color);
		this.draw = () => {
			ctx.fillStyle = this.color;
			ctx.fillRect(this.xOrigin, this.yOrigin, this.size, this.size);
		};
	}
};
