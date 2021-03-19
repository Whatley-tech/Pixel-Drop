const stage = {
	element: document.querySelector('#stage'),
	container: document.querySelector('#stageContainer'),
	backgroundLayer: undefined,
	brushOverlay: undefined,
	layers: [],
	activeLayer: undefined,
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

		this.backgroundLayer = this.makeCanvas('background', 0);
		this.brushOverlay = this.makeCanvas('brushOverlay', this.maxZIndex);

		this.appendLayerElement(this.backgroundLayer);
		this.setBoundingBox(this.backgroundLayer.element);
		this.activeLayer = this.backgroundLayer;
		brush.drawCheckerGrid();

		this.appendLayerElement(this.brushOverlay);
		this.newLayer();
		this.activeLayer = _.head(this.layers);
		layerPanel.toggleActive();
	},
	setBoundingBox(element) {
		let BoundingBox = element.getBoundingClientRect();
		this.leftOrigin = BoundingBox.left;
		this.topOrigin = BoundingBox.top;
	},
	makeCanvas(id = `${this.layers.length}`, zIndex = this.layers.length + 1) {
		return new Canvas(id, zIndex);
	},
	newLayer() {
		let layer = this.makeCanvas();
		this.appendLayerElement(layer);
		this.layers.push(layer);
	},
	appendLayerElement(layer) {
		this.element.appendChild(layer.element);
	},

	deleteLayer() {},
	clearStage() {},
};
