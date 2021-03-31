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
		const containerWidth = this.stagePanelDiv.clientWidth;
		const containerHeight = this.stagePanelDiv.clientHeight;
		const colSize = Math.floor(containerWidth / this.cols);
		const rowSize = Math.floor(containerHeight / this.rows);
		const pixelSize = colSize >= rowSize ? rowSize : colSize;
		return pixelSize;
	},
	get leftOrigin() {
		return this.background.element.getBoundingClientRect().left;
	},
	get topOrigin() {
		return this.background.element.getBoundingClientRect().top;
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
			this.updateCanvasImg(this.activeLayer);
		});
		window.addEventListener('resize', () => {
			this.resizeWindow();
			_.each(this.layers, (layer) => this.redrawCanvas(layer));
			this.redrawCanvas(this.background);
			this.redrawCanvas(this.brushOverlay);
		});
	},
	init(rows, cols) {
		this.rows = rows;
		this.cols = cols;

		this.background = this.makeCanvas('background', 0);
		this.appendToStageDiv(this.background);

		this.activeLayer = this.background;
		toolsPanel.activeTool.drawCheckerGrid();
		stage.updateCanvasImg(this.background);

		this.brushOverlay = this.makeCanvas('brushOverlay', this.maxZIndex);
		this.appendToStageDiv(this.brushOverlay);

		this.mergedView = this.makeCanvas('mergedView', this.maxZIndex - 1);
		this.appendToStageDiv(this.mergedView);

		this.newLayer();
		this.activeLayer = _.head(this.layers);
		layerPanel.activeTile = this.activeLayer.tile;
		this.attachStageListeners();
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
	setActiveLayer(layer) {
		stage.activeLayer = layer;
		layerPanel.activeTile = layer.tile;
		layerPanel.updateTiles();
	},

	appendToStageDiv(canvas) {
		this.mainDiv.appendChild(canvas.element);
	},
	appendToLayerDiv(canvas) {
		this.layersDiv.appendChild(canvas.element);
	},
	updateZIndexes() {
		for (let i = 0; i < this.layers.length; i++) {
			let canvas = this.layers[i];
			canvas.element.style.zIndex = i + 1;
		}
	},
	moveIndex(currentIndex, prevIndex) {
		element = this.layers[prevIndex];
		this.layers.splice(prevIndex, 1);
		this.layers.splice(currentIndex, 0, element);
	},
	copyImage(canvas) {
		return canvas.ctx.getImageData(0, 0, this.scaledWidth, this.scaledHeight);
	},
	copyImageURL(canvas) {
		let img = new Image();
		img.src = canvas.element.toDataURL();
		return img;
	},
	clearImage(canvas) {
		canvas.ctx.clearRect(0, 0, this.styleWidth, this.styleHeight);
	},
	updateCanvasImg(canvas) {
		let imgData = stage.copyImageURL(canvas);
		canvas.img = imgData;
	},
	resizeCanvas(canvas) {
		canvas.element.width = stage.scaledWidth;
		canvas.element.height = stage.scaledHeight;
		canvas.element.style.width = `${this.styleWidth}px`;
		canvas.element.style.height = `${this.styleHeight}px`;
	},
	resizeWindow() {
		_.each(this.layers, (layer) => this.resizeCanvas(layer));
		this.resizeCanvas(this.background);
		this.resizeCanvas(this.brushOverlay);
		this.resizeCanvas(this.mergedView);
	},
	redrawCanvas(canvas) {
		this.clearImage(canvas);
		canvas.ctx.setTransform(1, 0, 0, 1, 0, 0);
		canvas.ctx.scale(this.dpr, this.dpr);
		if (canvas.img) {
			canvas.ctx.drawImage(
				canvas.img,
				0,
				0,
				stage.styleWidth,
				stage.styleHeight
			);
		}
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
