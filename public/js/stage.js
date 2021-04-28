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
			if (toolsPanel.activeTool.undoAble) {
				statePanel.saveState('toolAction', this.activeLayer.state());
			}
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

	init(height, width, lastLayerNum, prevLayers, prevActiveLayer) {
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

		layerPanel.setLayerPviewDim();

		if (!this.appIsInit) {
			this.attachStageListeners();
		}

		if (lastLayerNum && prevLayers) {
			this.sessionStorage = true;
			this.lastLayerNum = lastLayerNum;
			this.restorePrevSession(prevLayers).then(() => {
				let activeLayer = _.find(stage.layers, (layer) => {
					return layer.uuid === prevActiveLayer;
				});
				this.setActiveLayer(activeLayer);
			});
		}
		if (!stage.sessionStorage) {
			this.newLayer().then((layer) => {
				this.setActiveLayer(layer);
				this.updateZIndexes();
			});
		}
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

	findLayer(searchTerm, property, callback) {
		let foundLayer = _.find(stage.layers, (l) => {
			if (typeof searchTerm === 'string') {
				return l[property] === searchTerm;
			}
			if (typeof searchTerm === 'object') {
				return l[property] === searchTerm[property];
			}
		});
		if (callback) callback(foundLayer);
		else return foundLayer;
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
		}
		if (hr > wr) {
			this.stageDiv.style.height = `${Math.floor(this.height * wr)}px`;
			this.stageDiv.style.width = `${Math.floor(this.width * wr)}px`;
		}
	},

	checkWindowSize() {
		const windowWidth = window.innerWidth;
		const bsLrgGridmin = 992; //bootstrap large grid, minimum pixel size
		const setVertical = () => {
			layerPanel.layerPanel.classList.replace('dropend', 'dropup');
			if (this.stagePanel.classList.contains('stagePanel-vert')) return;
			this.stagePanel.classList.replace('stagePanel-wide', 'stagePanel-vert');
		};
		const setWide = () => {
			layerPanel.layerPanel.classList.replace('dropup', 'dropend');
			if (this.stagePanel.classList.contains('stagePanel-wide')) return;
			this.stagePanel.classList.replace('stagePanel-vert', 'stagePanel-wide');
		};

		if (windowWidth >= bsLrgGridmin) {
			setWide();
		} else setVertical();
	},

	async restorePrevSession(prevLayers) {
		const newLayers = [];
		_.each(prevLayers, (layer) => {
			const { uuid, zIndex, name, imgDataUri } = layer;
			newLayers.push(stage.newLayer(uuid, zIndex, name, imgDataUri));
		});
		await Promise.all(newLayers);
	},

	makeCanvas(uuid = uuidv4(), zIndex) {
		return new Canvas(uuid, zIndex);
	},

	makeLayer(uuid, zIndex, name) {
		return new Promise((res, rej) => {
			const layer = new Layer(uuid, zIndex, name);
			res(layer);
		});
	},

	async newLayer(
		uuid = uuidv4(),
		zIndex = this.nextLayerZindex,
		name = this.nextlayerName,
		imgDataUri
	) {
		let layer = await this.makeLayer(uuid, zIndex, name);
		this.appendToLayerDiv(layer);
		this.layers.push(layer);
		if (imgDataUri) await layer.renderCanvas(imgDataUri);
		return layer;
	},

	setActiveLayer(layer) {
		this.activeLayer = layer;
		layerPanel.activeTile = layer.tile;
		layerPanel.updateTiles();
	},

	appendToStageDiv(canvas) {
		//stage canvases... bg, overlay, merged
		this.mainDiv.appendChild(canvas.element);
	},

	appendToLayerDiv(canvas) {
		//painting canvases,
		this.layersDiv.appendChild(canvas.element);
	},

	updateZIndexes() {
		for (let i = 0; i < this.layers.length; i++) {
			let canvas = this.layers[i];
			canvas.element.style.zIndex = i + 1;
			canvas.zIndex = i + 1;
		}
	},

	findArrayIndex(arr, element) {
		const index = _.findIndex(arr, element);
		return index;
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

	deleteLayer(layer) {
		const deletedLayer = this.findLayer(layer, 'uuid');
		_.remove(this.layers, deletedLayer);
		deletedLayer.element.remove();
		deletedLayer.tile.remove();
		if (deletedLayer.tile === layerPanel.activeTile) {
			this.setActiveLayer(_.last(this.layers));
		}
		layerPanel.updateTiles();
		autoSave();
	},

	moveIndex(moveToIndex, moveFromIndex) {
		element = this.layers[moveFromIndex];
		this.layers.splice(moveFromIndex, 1);
		this.layers.splice(moveToIndex, 0, element);
	},

	moveLayer(movedLayer) {
		let tiles = [...layerPanel.tileContainer.children];
		_.reverse(tiles);
		const currentTileIndex = this.findArrayIndex(tiles, movedLayer.tile);
		const currentLayerIndex = movedLayer.layerIndex();
		this.moveIndex(currentTileIndex, currentLayerIndex);
		this.updateZIndexes();
		layerPanel.updateTiles();
		autoSave();
	},

	restoreLayer(layerData) {
		const { uuid, zIndex, name, imgDataUri, layerIndex } = layerData;
		let layer = new Layer(uuid, zIndex, name);
		this.layers.splice(layerIndex, 0, layer);
		this.appendToLayerDiv(layer);
		if (imgDataUri) layer.renderCanvas(imgDataUri);
		this.setActiveLayer(layer);
		return layer;
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
