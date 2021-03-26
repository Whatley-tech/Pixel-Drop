const stage = {
	mainDiv: document.querySelector('#stage'),
	layersDiv: document.querySelector('#stageLayers'),
	stageContainerDiv: document.querySelector('#stageContainer'),
	background: undefined,
	brushOverlay: undefined,
	layers: [],
	activeLayer: undefined,
	rows: undefined,
	cols: undefined,
	leftOrigin: undefined,
	topOrigin: undefined,
	maxZIndex: 12,
	uniqueId: 0,

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
		const containerWidth = this.stageContainerDiv.scrollWidth;
		const containerHeight = this.stageContainerDiv.scrollHeight;
		const colSize = Math.floor(containerWidth / this.cols);
		const rowSize = Math.floor(containerHeight / this.rows);
		return colSize >= rowSize ? rowSize : colSize;
	},
	init(rows, cols) {
		this.rows = rows;
		this.cols = cols;

		this.background = this.makeCanvas('background', 0);
		this.appendToStageDiv(this.background);
		this.setBoundingBox(this.background.element);
		this.activeLayer = this.background;
		toolsPanel.activeTool.drawCheckerGrid();

		this.brushOverlay = this.makeCanvas('brushOverlay', this.maxZIndex);
		this.appendToStageDiv(this.brushOverlay);

		this.newLayer();
		this.activeLayer = _.head(this.layers);
		layerPanel.activetile = this.activeLayer.tile;
		this.attachStageListeners();
	},
	setBoundingBox(element) {
		let BoundingBox = element.getBoundingClientRect();
		this.leftOrigin = BoundingBox.left;
		this.topOrigin = BoundingBox.top;
	},
	makeCanvas(id = `${++this.uniqueId}`, zIndex) {
		return new Canvas(id, zIndex);
	},
	makeLayer(id = `${++this.uniqueId}`, zIndex) {
		return new Layer(id, zIndex);
	},
	newLayer() {
		let layer = this.makeLayer();
		this.appendToLayerDiv(layer);
		this.layers.push(layer);
		return layer;
	},
	updateZIndexes() {
		for (let i = 0; i < this.layers.length; i++) {
			let canvas = this.layers[i];
			canvas.element.style.zIndex = i + 1;
		}
	},
	appendToStageDiv(canvas) {
		this.mainDiv.appendChild(canvas.element);
	},
	appendToLayerDiv(canvas) {
		this.layersDiv.appendChild(canvas.element);
	},
	moveIndex(currentIndex, prevIndex) {
		element = this.layers[prevIndex];
		this.layers.splice(prevIndex, 1);
		this.layers.splice(currentIndex, 0, element);
	},
	attachStageListeners() {
		this.mainDiv.addEventListener('mousedown', (e) => {
			statePanel.saveState();
			toolsPanel.activeTool.isDrawing = true;
			toolsPanel.activeTool.action();
		});
		this.mainDiv.addEventListener('mousemove', (e) => {
			toolsPanel.activeTool.updatePosition(e);
			if (toolsPanel.activeTool.isDrawing) toolsPanel.activeTool.action();
		});
		this.mainDiv.addEventListener('mouseleave', () => {
			toolsPanel.activeTool.isDrawing = false;
		});
		this.mainDiv.addEventListener('mouseup', (e) => {
			toolsPanel.activeTool.releaseAction();
			toolsPanel.activeTool.isDrawing = false;
		});
	},
	get state() {},
	updateLayerStates() {},
	deleteLayer() {},
	clearStage() {},
};
