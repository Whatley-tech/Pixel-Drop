//logic for the layerPanel functionality
const layerPanel = {
	newLayerBtn: document.querySelector('#newLayerBtn'),
	tileContainer: document.querySelector('#tileContainer'),
	tileTemplate: document.querySelector(`.tile[data-uuid='template']`),
	activeLayerPreview: document.querySelector('#activeLayerPreview'),
	layerMenuBtn: document.getElementById('layerMenuBtn'),
	layerPanel: document.querySelector('#layerPanel'),
	layerMenu: document.getElementById('layerMenu'),
	tileRenameForm: document.getElementById('tileRenameForm'),
	tileRenameInput: document.getElementById('tileRenameInput'),
	layerPview: document.getElementById('layerPview'),
	layerPviewCtx: layerPview.getContext('2d'),

	activeTile: undefined,
	get tileCount() {
		return this.tileContainer.children.length;
	},
	init() {
		this.updateTiles();
		this.addLayerPanelListeners();
		this.toggleActive();
		this.setLayerPviewDim();
		$('#tileContainer').sortable({
			stop: (event, ui) => this.moveLayer(ui.item[0]),
		});
	},
	setLayerPviewDim() {
		this.layerPview.width = stage.width;
		this.layerPview.height = stage.height;
	},
	moveLayer(movedLayerTile) {
		const layer = _.find(stage.layers, (layer) => layer.tile == movedLayerTile);
		statePanel.saveState('arrange', layer);
		let tiles = [...this.tileContainer.children];
		_.reverse(tiles);
		const currentTileIndex = this.findArrayIndex(tiles, movedLayerTile);
		const prevTileIndex = this.findArrayIndex(stage.layers, (layer) => {
			return layer.tile == movedLayerTile;
		});
		stage.moveIndex(currentTileIndex, prevTileIndex);
		stage.updateZIndexes();
		this.updateTiles();
		autoSave();
	},
	deleteLayer(deletedLayer) {
		statePanel.saveState('layer', deletedLayer);
		_.find(stage.layers, (layer) => {
			if (layer && layer.element === deletedLayer.element)
				_.remove(stage.layers, layer);
		});
		deletedLayer.element.remove();
		deletedLayer.tile.remove();

		if (deletedLayer.tile === layerPanel.activeTile) {
			stage.setActiveLayer(_.last(stage.layers));
		}
		this.updateTiles();
		autoSave();
	},
	findArrayIndex(arr, element) {
		const index = _.findIndex(arr, element);
		return index;
	},
	updateTiles() {
		_.each(this.tileContainer.children, (child) => {
			if (child && child.dataset.uuid != this.tileTemplate.dataset.uuid)
				child.remove();
		});

		_.eachRight(stage.layers, (layer) => {
			this.tileContainer.appendChild(layer.tile);
		});
		this.toggleActive();
	},
	updateLayerPview() {
		this.layerPviewCtx.clearRect(0, 0, stage.width, stage.height);
		this.layerPviewCtx.drawImage(stage.activeLayer.element, 0, 0);
	},

	toggleActive() {
		const currentlyActive = document.querySelectorAll('#tileContainer .active');
		if (currentlyActive.length) {
			_.each(currentlyActive, (node) => {
				node.classList.toggle('active');
			});
		}
		if (this.activeTile) {
			this.activeTile.classList.toggle('active');
			this.layerMenuBtn.innerText = this.activeTile.name;
			this.updateLayerPview();
		}
	},
	addLayerPanelListeners() {
		this.newLayerBtn.addEventListener('click', (e) => {
			e.stopPropagation();
			if (this.tileCount > 8) return; //max layers
			const newLayer = stage.newLayer();
			statePanel.saveState('layer', newLayer);
			this.toggleActive();
		});
		this.layerMenuBtn.addEventListener('shown.bs.dropdown', (e) => {
			_.each(stage.layers, (layer) => layer.updateTilePreview());
		});

		tileRenameForm.addEventListener('submit', (e) => {
			e.preventDefault();
			let currentTileName = renameTileModal.dataset.tileName;
			let newName = tileRenameInput.value;
			let layer = _.find(stage.layers, (l) => {
				return l.tile.name == currentTileName;
			});
			layer.renameModal.toggle();
			layer.renameTile(newName);
			this.updateTiles();
		});
	},
};
