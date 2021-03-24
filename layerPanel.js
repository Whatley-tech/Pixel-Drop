const layerPanel = {
	newLayerBtn: document.querySelector('#newLayerBtn'),
	tileContainer: document.querySelector('#tileContainer'),
	activeLayerTile: undefined,
	init() {
		this.updateLayerTiles();
		this.addLayerPanelListeners();
		this.toggleActive();
		$('#tileContainer').sortable({
			stop: (e, ui) => this.updateStage(ui.item[0].id),
		});
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
	updateStage(element) {
		// console.log(ui.item[0].id);
		const currentTileIndex = findCurrentIndex(element);
		const prevTileIndex = findPrevIndex(element);

		stage.moveIndex(currentTileIndex, prevTileIndex);
		stage.updateZindex();

		// const changedElement = _.findIndex(stage.layers, function (layer) {
		// 	return layer.layerTile.id == element;
		// });

		// console.log(changedElement);
	},
	orderLayers() {},
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
