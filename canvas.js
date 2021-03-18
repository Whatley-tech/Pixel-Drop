class Canvas {
	constructor(rows, cols) {
		this.rows = rows;
		this.cols = cols;
		this.scale = window.devicePixelRatio;
		this.width = null;
		this.height = null;
		this.scaledWidth = null;
		this.scaledHeight = null;
		this.stage = document.querySelector('#stage');
		this.canvasContainer = document.querySelector('#canvasContainer');
		this.element = null;
		this.ctx = null;
		this.pixelSize = null;
		this.topOrigin = null;
		this.leftOrigin = null;
		this.undoStates = [];
		this.redoStates = [];
	}

	createCanvasElement(id) {
		this.element = document.createElement('canvas');
		this.ctx = this.element.getContext('2d');
		this.findPixelSize();
		// this.updateBrushSize();
		this.width = this.cols * this.pixelSize;
		this.height = this.rows * this.pixelSize;
		this.scaledWidth = Math.floor(this.cols * this.pixelSize * this.scale);
		this.scaledHeight = Math.floor(this.rows * this.pixelSize * this.scale);
		this.element.id = id;
		this.element.style.width = `${this.width}px`;
		this.element.style.height = `${this.height}px`;
		this.element.width = this.scaledWidth;
		this.element.height = this.scaledHeight;
		this.element.classList.add('canvas', id);
		this.ctx.scale(this.scale, this.scale);
	}

	appendCanvasElement() {
		this.stage.appendChild(this.element);
		let box = this.element.getBoundingClientRect();
		this.leftOrigin = box.left;
		this.topOrigin = box.top;
	}

	findPixelSize() {
		const containerWidth = this.canvasContainer.scrollWidth;
		const containerHeight = this.canvasContainer.scrollHeight;
		const colSize = Math.floor(containerWidth / this.cols);
		const rowSize = Math.floor(containerHeight / this.rows);
		this.pixelSize = colSize >= rowSize ? rowSize : colSize;
	}

	drawGrid() {
		const lightGray = '#d7d7d7';
		const darkGray = '#fafafa';
		const rows = this.rows;
		const cols = this.cols;
		const pixelSize = this.pixelSize;
		let colorOffset = 0;

		for (let x = 0; x < cols; x++) {
			colorOffset % 2 === 0
				? (pallet.currentColor = darkGray)
				: (pallet.currentColor = lightGray);
			colorOffset++;
			for (let y = 0; y < rows; y++) {
				pallet.currentColor === lightGray
					? (pallet.currentColor = darkGray)
					: (pallet.currentColor = lightGray);
				this.drawPixel(x, y);
			}
		}
	}

	drawPixel(x = brush.xPixelPosition, y = brush.yPixelPosition) {
		let xOrigin = x * this.pixelSize;
		let yOrigin = y * this.pixelSize;

		this.ctx.fillStyle = pallet.currentColor;
		this.ctx.fillRect(
			xOrigin,
			yOrigin,
			this.pixelSize * brush.size,
			this.pixelSize * brush.size
		);
	}

	get state() {
		return this.ctx.getImageData(0, 0, this.scaledWidth, this.scaledHeight);
	}
	drawState(img) {
		this.ctx.putImageData(img, 0, 0);
	}

	saveState() {
		_.remove(this.redoStates);
		const currentState = this.state;
		this.undoStates.push(currentState);
		console.log(`undos: ${this.undoStates}, redos: ${this.redoStates}`);
	}

	undo() {
		try {
			let currentState = this.getState();
			let lastState = this.undoStates.pop();
			this.redoStates.push(currentState);
			this.drawState(lastState);
			console.log(`undos: ${this.undoStates}, redos: ${this.redoStates}`);
		} catch {
			console.log('Error: There are no more undo states!');
		}
	}

	redo() {
		try {
			const state = this.redoStates.pop();
			this.drawState(state);
			this.undoStates.push(state);
			console.log(`undos: ${this.undoStates}, redos: ${this.redoStates}`);
		} catch {
			console.log('Error: There are no more redo states!');
		}
	}
}
