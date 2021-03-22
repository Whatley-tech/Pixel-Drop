const layerPanel = {
	newLayerBtn: document.querySelector('#newLayerBtn'),
	tileContainer: document.querySelector('#tileContainer'),
	activeLayerTile: undefined,
	init() {
		this.updateLayerTiles();
		this.addLayerPanelListeners();
		this.toggleActive();
	},
	// updateLayerTileBG() {
	// 	const img = stage.activeLayerImg;
	// 	this.activeLayerTile.style.background = img;
	// 	document.write(img);
	// 	console.log(img);
	// },
	removeLayer() {},
	moveLayer() {},
	addNewLayer() {
		stage.newLayer();
		this.updateLayerTiles();
	},
	updateLayerTiles() {
		_.each(this.tileContainer.children, (child) => {
			if (child) child.remove();
		});

		_.eachRight(stage.layers, (layer) => {
			this.tileContainer.appendChild(layer.layerTile);
		});
	},
	toggleActive() {
		const currentlyActive = document.querySelector('#tileContainer .active');
		if (currentlyActive) currentlyActive.classList.toggle('active');
		this.activeLayerTile.classList.toggle('active');
	},
	addLayerPanelListeners() {
		this.newLayerBtn.addEventListener('click', () => this.addNewLayer());
	},
};
