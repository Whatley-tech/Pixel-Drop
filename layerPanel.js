const layerPanel = {
	newLayerBtn: document.querySelector('#newLayerBtn'),
	tileContainer: document.querySelector('#tileContainer'),
	activetile: undefined,
	init() {
		this.updatetiles();
		this.addLayerPanelListeners();
		this.toggleActive();
		$('#tileContainer').sortable({
			stop: (e, ui) => this.updateStage(ui.item[0]),
		});
	},
	// updatetileBG() {
	// 	const img = stage.activeLayerImg;
	// 	this.activetile.style.background = img;
	// 	document.write(img);
	// 	console.log(img);
	// },
	removeLayer() {},
	moveLayer() {},
	addNewLayer() {
		stage.newLayer();
		this.updatetiles();
	},
	updateStage(element) {
		const currentTileIndex = this.findArrayIndex(
			_.reverse([...this.tileContainer.children]),
			element
		);
		const prevTileIndex = this.findArrayIndex(stage.layers, (layer) => {
			return layer.tile == element;
		});
		stage.moveIndex(currentTileIndex, prevTileIndex);
		this.updatetiles();
		stage.updateZIndexes();
	},
	findArrayIndex(arr, element) {
		const index = _.findIndex(arr, element);
		return index;
	},
	updatetiles() {
		_.each(this.tileContainer.children, (child) => {
			if (child) child.remove();
		});

		_.eachRight(stage.layers, (layer) => {
			this.tileContainer.appendChild(layer.tile);
		});
	},
	toggleActive() {
		const currentlyActive = document.querySelector('#tileContainer .active');
		if (currentlyActive) currentlyActive.classList.toggle('active');
		this.activetile.classList.toggle('active');
	},
	addLayerPanelListeners() {
		this.newLayerBtn.addEventListener('click', () => this.addNewLayer());
	},
};
