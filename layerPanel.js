const layerPanel = {
	newLayerBtn: document.querySelector('#newLayerBtn'),
	tileContainer: document.querySelector('#tileContainer'),
	init() {
		this.updateLayerTiles();
		this.newLayerBtn.addEventListener('click', () => this.addNewLayer());
		this.toggleActive();
	},
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
		const currentlyActive = document.querySelector('.active');
		if (currentlyActive) currentlyActive.classList.toggle('active');
		stage.activeLayer.layerTile.classList.toggle('active');
	},
};
