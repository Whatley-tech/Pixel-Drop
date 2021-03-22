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
		layerPanel.activeLayerTile = this.activeLayer.layerTile;
		this.attachStageListeners();
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
		this.appendToLayerDiv(layer);
		this.layers.push(layer);
	},
	appendToStageDiv(canvas) {
		this.mainDiv.appendChild(canvas.element);
	},
	appendToLayerDiv(canvas) {
		this.layersDiv.appendChild(canvas.element);
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
			toolsPanel.activeTool.isDrawing = false;
		});
	},
	get state() {},
	updateLayerStates() {},
	deleteLayer() {},
	clearStage() {},
};
