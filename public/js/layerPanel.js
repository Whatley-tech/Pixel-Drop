//logic for the layerPanel functionality
const layerPanel = {
	newLayerBtn: document.querySelector('#newLayerBtn'),
	tileContainer: document.querySelector('#tileContainer'),
	tileTemplate: document.querySelector(`.tile[data-uuid='template']`),
	activeLayerPreview: document.querySelector('#activeLayerPreview'),
	layerMenuBtn: document.getElementById('layerMenuBtn'),
	layerPanel: document.querySelector('#layerPanel'),
	layerMenu: document.getElementById('layerMenu'),
	layerPview: document.getElementById('layerPview'),
	layerPviewCtx: layerPview.getContext('2d'),
	renameModal: new bootstrap.Modal(document.querySelector('#renameTileModal')),
	tileRenameForm: document.getElementById('tileRenameForm'),
	renameModalElement: document.querySelector('#renameTileModal'),
	tileRenameInput: document.querySelector('#tileRenameInput'),
	renameBtn: document.querySelector('#renameBtn'),
	activeTile: undefined,

	get tileCount() {
		return this.tileContainer.children.length;
	},

	init() {
		this.updateTiles();
		this.addLayerPanelListeners();
		this.setLayerPviewDim();
	},

	setLayerPviewDim() {
		this.layerPview.width = stage.width;
		this.layerPview.height = stage.height;
	},

	updateTiles() {
		_.each(this.tileContainer.children, (child) => {
			if (child) child.remove();
		});

		_.eachRight(stage.layers, (layer) => {
			this.tileContainer.appendChild(layer.layerTile);
		});

		stage.toggleActive();
	},

	updateLayerPview() {
		this.layerPviewCtx.clearRect(0, 0, stage.width, stage.height);
		this.layerPviewCtx.drawImage(stage.activeLayer.element, 0, 0);
	},

	addLayerPanelListeners() {
		this.newLayerBtn.addEventListener('click', (e) => {
			e.stopPropagation();
			if (this.tileCount > 8) return; //max layers

			stage.newLayer().then((layer) => {
				stage.setActiveLayer(layer);
				stage.updateZIndexes();
				statePanel.saveState('newLayer', layer.state);
				autoSave();
			});
		});

		this.layerMenuBtn.addEventListener('shown.bs.dropdown', (e) => {
			_.each(stage.layers, (layer) => layer.updateTilePreview());
		});

		this.renameModalElement.addEventListener('shown.bs.modal', (e) => {
			const oldName = e.target.dataset.name;
			this.tileRenameInput.placeholder = e.target.dataset.name;
		});

		this.renameModalElement.addEventListener('hide.bs.modal', (e) => {
			this.tileRenameInput.value = '';
		});

		this.tileRenameForm.addEventListener('submit', (e) => {
			e.preventDefault();
			const oldName = this.renameModalElement.dataset.name;
			const newName = this.tileRenameInput.value;
			const layer = stage.findLayer(oldName, 'name');
			layer.renameTile(newName);
			this.renameModal.toggle();
			this.updateTiles();
			autoSave();
		});
	},
};
