const layerPanel = {
	newLayerBtn: document.querySelector('#newLayerBtn'),
	tileContainer: document.querySelector('#tileContainer'),
	tileTemplate: document.querySelector('#tileTemplate'),
	activeTile: undefined,
	init() {
		this.updateTiles();
		this.addLayerPanelListeners();
		this.toggleActive();
		$('#tileContainer').sortable({
			stop: (event, ui) => this.updateStage(ui.item[0]),
		});
	},

	addNewLayer() {
		const layer = stage.newLayer();
		stage.activeLayer = layer;
		layerPanel.activeTile = layer.tile;
		this.updateTiles();
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
		this.updateTiles();
		stage.updateZIndexes();
	},
	findArrayIndex(arr, element) {
		const index = _.findIndex(arr, element);
		return index;
	},
	updateTiles() {
		_.each(this.tileContainer.children, (child) => {
			if (child && child.id != this.tileTemplate.id) child.remove();
		});

		_.eachRight(stage.layers, (layer) => {
			this.tileContainer.appendChild(layer.tile);
		});
		this.toggleActive();
	},
	toggleActive() {
		const currentlyActive = document.querySelector('#tileContainer .active');
		if (currentlyActive) currentlyActive.classList.toggle('active');
		this.activeTile.classList.toggle('active');
	},
	addLayerPanelListeners() {
		this.newLayerBtn.addEventListener('click', () => this.addNewLayer());
	},
};
