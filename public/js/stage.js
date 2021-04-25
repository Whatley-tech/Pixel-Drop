const stage = {
	mainDiv: document.querySelector('#stage'),
	layersDiv: document.querySelector('#stageLayers'),
	stageDiv: document.querySelector('#stage'),
	stagePanel: document.querySelector('#stagePanel'),
	controls: document.querySelector('#controls'),
	layerPviewContainer: document.querySelector('#layerPviewContainer'),
	background: {},
	mergedView: {},
	brushOverlay: {},
	layers: [],
	activeLayer: {},
	height: 0,
	width: 0,
	maxZIndex: 12,
	lastLayerNum: 0,
	appIsInit: false,
	sessionStorage: false,

	get pixelSize() {
		return parseInt(this.stageDiv.style.height) / this.height;
	},
	get leftOrigin() {
		return this.stageDiv.getBoundingClientRect().left;
	},
	get topOrigin() {
		return this.stageDiv.getBoundingClientRect().top;
	},
	get nextLayerZindex() {
		return this.layers.length + 1;
	},
	get nextlayerName() {
		return `Layer-${++this.lastLayerNum}`;
	},

	attachStageListeners() {
		this.mainDiv.addEventListener('mousedown', (e) => {
			if (toolsPanel.activeTool.undoAble)
				statePanel.saveState('action', this.activeLayer);
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
			autoSave();
		});
		window.addEventListener('resize', () => {
			this.resizeStage();
		});
	},
	init(height, width, lastLayerNum, prevlayers) {
		this.height = height;
		this.width = width;
		this.resizeStage();

		this.mergedView = this.makeCanvas('mergedView', 0);
		this.appendToStageDiv(this.mergedView);

		this.background = this.makeCanvas('background', 0);
		this.appendToStageDiv(this.background);

		toolsPanel.brush.drawCheckerGrid(this.background);

		this.brushOverlay = this.makeCanvas('brushOverlay', this.maxZIndex);
		this.appendToStageDiv(this.brushOverlay);
		this.attachStageListeners();

		if (lastLayerNum && prevLayers) {
			this.sessionStorage = true;
			this.lastLayerNum = lastLayerNum;
			this.restorePrevSession(prevLayers);
		}
		if (!stage.sessionStorage) this.newLayer();
		this.appIsInit = true;
	},
	reset() {
		if (this.background.element) this.background.element.remove();
		if (this.brushOverlay.element) this.brushOverlay.element.remove();
		if (this.mergedView.element) this.mergedView.element.remove();
		this.clearLayers();
		_.remove(statePanel.undoStates);
		this.lastLayerNum = 0;
	},
	clearLayers() {
		_.each(this.layers, (layer) => {
			layer.element.remove();
			layer.tile.remove();
		});
		_.remove(stage.layers);
	},
	resizeStage() {
		this.checkWindowSize();
		const maxW = this.stagePanel.clientWidth;
		const maxH = this.stagePanel.clientHeight;
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
			this.controls.classList.replace('controls-wide', 'controls-vert');
		};
		const setWide = () => {
			layerPanel.layerPanel.classList.replace('dropup', 'dropend');
			if (this.stagePanel.classList.contains('stagePanel-wide')) return;
			this.stagePanel.classList.replace('stagePanel-vert', 'stagePanel-wide');
			this.controls.classList.replace('controls-vert', 'controls-wide');
		};

		if (windowWidth >= bsLrgGridmin) {
			setWide();
		} else setVertical();
	},
	restorePrevSession(prevLayers) {
		this.clearLayers();
		_.each(prevLayers, (layer) => {
			const { uuid, zIndex, name, imgDataUri } = layer;
			const img = new Image();
			img.onload = function () {
				stage.newLayer(uuid, zIndex, name, this);
			};
			img.src = imgDataUri;
		});
	},
	makeCanvas(uuid = uuidv4(), zIndex) {
		return new Canvas(uuid, zIndex);
	},
	newLayer(
		uuid = uuidv4(),
		zIndex = this.nextLayerZindex,
		name = this.nextlayerName,
		img
	) {
		let layer = new Layer(uuid, zIndex, name);
		this.appendToLayerDiv(layer);
		this.layers.push(layer);
		if (img) layer.renderCanvas(img);
		this.setActiveLayer(layer);
		return layer;
	},
	setActiveLayer(layer) {
		this.activeLayer = layer;
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
	updateMergedView() {
		this.mergedView.clearCanvas();
		_.each(this.layers, (layer) => {
			this.mergedView.ctx.drawImage(
				layer.element,
				0,
				0,
				this.width,
				this.height
			);
		});
	},
	restoreLayer(layer, index) {
		this.layers.splice(index, 0, layer);
		this.appendToLayerDiv(layer);
		this.setActiveLayer(layer);
		layer.renderCanvas();
	},
	exportImage(type, scaleValue) {
		const svg = this.createSVG(scaleValue);

		if (type == 'svg') {
			let newTab = window.open();
			newTab.document.body.appendChild(svg);
		}
		if (type == 'png') {
			let newTab = window.open();
			const dpr = window.devicePixelRatio,
				h = this.height * scaleValue,
				w = this.width * scaleValue,
				c = document.createElement('canvas'),
				ctx = c.getContext('2d');

			c.width = w * dpr;
			c.height = h * dpr;
			ctx.scale(dpr, dpr);
			this.drawSVGtoCanvas(svg, ctx, () => {
				let png = this.canvasToPNG(c, w, h);
				newTab.document.body.append(png);
			});
		}
	},
	createSVG(scaleValue = 1) {
		if (scaleValue < 1) return console.error('scale value less than 1');
		const newW = this.width * scaleValue,
			newH = this.height * scaleValue,
			ratio = newW / this.width,
			pixelCollection = this.getPixelData(),
			svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

		svg.setAttribute('width', `${newW}`);
		svg.setAttribute('height', `${newH}`);
		// svg.setAttribute('viewbox', `0 0 ${newW} ${newH}`);
		svg.setAttributeNS(
			'http://www.w3.org/2000/xmlns/',
			'xmlns:xlink',
			'http://www.w3.org/1999/xlink'
		);

		//create a rect element for each pixel
		for (let y = 0; y < this.height; y++) {
			for (let x = 0; x < this.width; x++) {
				let pointer = y * this.width + x,
					pixel = pixelCollection.pixels[pointer],
					color = this.UintToRGB(pixel),
					rect = this.makeSVGRect(x * ratio, y * ratio, ratio, ratio, color);

				svg.appendChild(rect);
			}
		}

		return svg;
	},
	makeSVGRect(x, y, width, height, color) {
		let rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
		rect.setAttribute('x', x);
		rect.setAttribute('y', y);
		rect.setAttribute('width', width);
		rect.setAttribute('height', height);
		rect.setAttribute('fill', color);
		rect.setAttribute('shape-rendering', 'crispEdges');
		return rect;
	},

	canvasToPNG(canvas, width, height) {
		let pngImg = new Image(width, height);
		pngImg.src = canvas.toDataURL();
		return pngImg;
	},
	drawSVGtoCanvas(svgElement, ctx, callback) {
		const svgURL = new XMLSerializer().serializeToString(svgElement);
		const img = new Image();
		img.onload = function () {
			ctx.drawImage(this, 0, 0);
			callback();
		};
		img.src = 'data:image/svg+xml; charset=utf8, ' + encodeURIComponent(svgURL);
	},
	getPixelData() {
		let pixelCollection = {
			imgHeight: this.height,
			imgWidth: this.width,
			pixels: [],
		};

		for (let y = 0; y < this.height; y++) {
			for (let x = 0; x < this.width; x++) {
				let pixel = this.mergedView.ctx.getImageData(x, y, 1, 1).data;
				pixelCollection.pixels.push(pixel);
			}
		}
		return pixelCollection;
	},
	UintToRGB(array) {
		const color = `rgb(${array[0]},${array[1]},${array[2]},${array[3]})`;
		return color;
	},
};
