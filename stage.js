const stage = {
	mainDiv: document.querySelector('#stage'),
	layersDiv: document.querySelector('#stageLayers'),
	stagePanelDiv: document.querySelector('#stagePanel'),
	background: undefined,
	mergedView: undefined,
	brushOverlay: undefined,
	layers: [],
	activeLayer: undefined,
	rows: undefined,
	cols: undefined,
	leftOrigin: undefined,
	topOrigin: undefined,
	maxZIndex: 12,
	uniqueId: 0,
	get dpr() {
		return window.devicePixelRatio;
	},
	get styleWidth() {
		//width of css style (shrinks dimensions)
		return this.cols * this.pixelSize;
	},
	get styleHeight() {
		return this.rows * this.pixelSize;
	},
	get scaledWidth() {
		//full res width of canvas before css style
		return this.cols * this.pixelSize * this.dpr;
	},
	get scaledHeight() {
		return this.rows * this.pixelSize * this.dpr;
	},
	get pixelSize() {
		const containerWidth = this.stagePanelDiv.scrollWidth;
		const containerHeight = this.stagePanelDiv.clientHeight;
		const colSize = Math.floor(containerWidth / this.cols);
		const rowSize = Math.floor(containerHeight / this.rows);
		const pixelSize = colSize >= rowSize ? rowSize : colSize;
		return pixelSize;
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

		this.mergedView = this.makeCanvas('mergedView', this.maxZIndex - 1);
		this.appendToStageDiv(this.mergedView);

		this.newLayer();
		this.activeLayer = _.head(this.layers);
		layerPanel.activeTile = this.activeLayer.tile;
		this.attachStageListeners();
	},
	resizeCanvas(canvas) {
		let img = this.copyImage(canvas);
		canvas.element.style.width = `${this.styleWidth}px`;
		canvas.element.style.height = `${this.styleHeight}px`;
		canvas.ctx.putImageData(img, 0, 0);
		canvas.ctx.scale(this.dpr, this.dpr);
	},
	resizeWindow() {
		this.resizeCanvas(...this.layers);
		this.resizeCanvas(this.background);
		this.resizeCanvas(this.brushOverlay);
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
		this.setActiveLayer(layer);
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
			if (toolsPanel.activeTool.undoAble) statePanel.saveState('action');
			statePanel.clearRedos();
			toolsPanel.activeTool.isDrawing = true;
			toolsPanel.activeTool.startAction();
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
		window.addEventListener('resize', () => {
			this.resizeWindow();
		});
	},
	copyImage(canvas) {
		return canvas.ctx.getImageData(0, 0, this.scaledWidth, this.scaledHeight);
	},
	clearImage(canvas) {
		canvas.ctx.clearRect(0, 0, this.styleWidth, this.styleHeight);
	},
	setActiveLayer(layer) {
		stage.activeLayer = layer;
		layerPanel.activeTile = layer.tile;
		layerPanel.updateTiles();
	},
	setMergedView() {
		_.each(stage.layers, (layer) => {
			stage.mergedView.ctx.drawImage(
				layer.element,
				0,
				0,
				this.styleHeight,
				this.styleWidth
			);
		});
	},
	restoreLayer(layer, index, img) {
		stage.layers.splice(index, 0, layer);
		this.appendToLayerDiv(layer);
		layer.ctx.putImageData(img, 0, 0);
		this.setActiveLayer(layer);
	},
};
