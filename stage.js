const stage = {
	mainDiv: document.querySelector('#stage'),
	layersDiv: document.querySelector('#stageLayers'),
	stageDiv: document.querySelector('#stage'),
	stagePanel: document.querySelector('#stagePanel'),
	controlsContainer: document.querySelector('#controlsContainer'),
	controlsPanel: document.querySelector('#controlsPanel'),
	background: undefined,
	mergedView: undefined,
	brushOverlay: undefined,
	layers: [],
	activeLayer: undefined,
	height: undefined,
	width: undefined,
	maxZIndex: 12,
	uniqueId: 0,

	get pixelSize() {
		return parseInt(this.stageDiv.style.height) / stage.height;
	},
	get leftOrigin() {
		return this.stageDiv.getBoundingClientRect().left;
	},
	get topOrigin() {
		return this.stageDiv.getBoundingClientRect().top;
	},

	attachStageListeners() {
		this.mainDiv.addEventListener('mousedown', (e) => {
			if (toolsPanel.activeTool.undoAble)
				statePanel.saveState('action', stage.activeLayer);
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
			layerPanel.updateLayerPview();
		});
		window.addEventListener('resize', () => {
			this.resizeStage();
		});
	},
	init(height, width) {
		this.height = height;
		this.width = width;

		this.resizeStage();

		this.background = this.makeCanvas('background', 0);
		this.appendToStageDiv(this.background);

		toolsPanel.brush.drawCheckerGrid(this.background);

		this.brushOverlay = this.makeCanvas('brushOverlay', this.maxZIndex);
		this.appendToStageDiv(this.brushOverlay);

		this.mergedView = this.makeCanvas('mergedView', this.maxZIndex - 1);
		this.appendToStageDiv(this.mergedView);

		this.newLayer();
		this.activeLayer = _.head(this.layers);
		layerPanel.activeTile = this.activeLayer.tile;
		this.attachStageListeners();
	},
	reset() {
		if (this.background) this.background.element.remove();
		if (this.brushOverlay) this.brushOverlay.element.remove();
		if (this.mergedView) this.mergedView.element.remove();
		_.each(this.layers, (layer) => {
			layer.element.remove();
			layer.tile.remove();
		});
		_.remove(this.layers);
		_.remove(statePanel.undoStates);
	},

	resizeStage() {
		this.checkWindowSize();
		const maxW = this.stagePanel.clientWidth;
		const maxH = this.stagePanel.clientHeight;
		console.log(maxW, maxH);
		const wr = maxW / this.width;
		const hr = maxH / this.height;

		if (wr > hr) {
			this.stageDiv.style.height = `${Math.floor(this.height * hr)}px`;
			this.stageDiv.style.width = `${Math.floor(this.width * hr)}px`;
			// console.log('asdf');
		}
		if (hr > wr) {
			this.stageDiv.style.height = `${Math.floor(this.height * wr)}px`;
			this.stageDiv.style.width = `${Math.floor(this.width * wr)}px`;
			// console.log('asdf');
		}
	},
	checkWindowSize() {
		const windowWidth = window.innerWidth;
		const bsLrgGridmin = 992; //bootstrap large grid, minimum pixel size
		const setVertical = () => {
			layerPanel.layerPanel.classList.replace('dropend', 'dropup');
			if (this.stagePanel.classList.contains('stagePanel-vert')) return;
			this.stagePanel.classList.replace('stagePanel-wide', 'stagePanel-vert');
			this.controlsPanel.classList.replace(
				'controlsPanel-wide',
				'controlsPanel-vert'
			);
		};
		const setWide = () => {
			layerPanel.layerPanel.classList.replace('dropup', 'dropend');
			if (this.stagePanel.classList.contains('stagePanel-wide')) return;
			this.stagePanel.classList.replace('stagePanel-vert', 'stagePanel-wide');
			this.controlsPanel.classList.replace(
				'controlsPanel-vert',
				'controlsPanel-wide'
			);
		};

		if (windowWidth >= bsLrgGridmin) {
			setWide();
		} else setVertical();
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
	setMergedView() {
		_.each(stage.layers, (layer) => {
			stage.mergedView.ctx.drawImage(layer.img, 0, 0);
		});
	},
	restoreLayer(layer, index) {
		stage.layers.splice(index, 0, layer);
		this.appendToLayerDiv(layer);
		this.setActiveLayer(layer);
		layer.renderCanvas();
	},
};
