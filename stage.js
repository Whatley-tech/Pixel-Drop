const stage = {
	element: document.querySelector('#stage'),
	container: document.querySelector('#stageContainer'),
	backgroundLayer: undefined,
	brushOverlay: undefined,
	layers: [],
	activeLayerCtx: undefined,
	rows: undefined,
	cols: undefined,
	leftOrigin: undefined,
	topOrigin: undefined,
	maxZIndex: 12,

	get scale() {
		return window.devicePixelRatio;
	},
	get width() {
		return this.cols * this.pixelSize;
	},
	get scaledWidth() {
		return Math.floor(this.cols * this.pixelSize * this.scale);
	},
	get height() {
		return this.rows * this.pixelSize;
	},
	get scaledHeight() {
		return Math.floor(this.rows * this.pixelSize * this.scale);
	},
	get pixelSize() {
		const containerWidth = this.container.scrollWidth;
		const containerHeight = this.container.scrollHeight;
		const colSize = Math.floor(containerWidth / this.cols);
		const rowSize = Math.floor(containerHeight / this.rows);
		return colSize >= rowSize ? rowSize : colSize;
	},
	initStage(rows, cols) {
		this.rows = rows;
		this.cols = cols;

		this.backgroundLayer = this.newLayer('background', 0);
		this.brushOverlay = this.newLayer('brushOverlay', this.maxZIndex);
		this.layers.push(this.newLayer());

		this.appendLayerElement(this.backgroundLayer);
		this.setBoundingBox(this.backgroundLayer.element);
		this.activeLayerCtx = this.backgroundLayer.ctx;
		brush.drawCheckerGrid();

		this.appendLayerElement(this.brushOverlay);
		this.appendLayerElement(...this.layers);
		this.activeLayerCtx = _.head(this.layers).ctx;
	},
	setBoundingBox(element) {
		let BoundingBox = element.getBoundingClientRect();
		this.leftOrigin = BoundingBox.left;
		this.topOrigin = BoundingBox.top;
	},
	newLayer(id = `layer${this.layers.length}`, zIndex = this.layers.length) {
		return new Canvas(id, zIndex);
	},
	appendLayerElement(layer) {
		this.element.appendChild(layer.element);
	},
	deleteLayer() {},
	clearStage() {},
};
