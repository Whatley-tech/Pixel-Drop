const layerPanel = {
	newLayerBtn: document.querySelector('#newLayerBtn'),
	tileContainer: document.querySelector('#tileContainer'),
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
	sortable: new Sortable(tileContainer, {
		animation: 200,
		draggable: '.layer-tile',
		easing: 'cubic-bezier(1, 0, 0, 1)',
		swapThreshold: 0.7,
		ghostClass: 'ghost-class',
		direction: 'horizontal',
		onEnd: (evt) => {
			stage.moveLayer(evt.oldIndex, evt.newIndex);
		},
	}),

	get tileCount() {
		return this.tileContainer.children.length;
	},

	init() {
		this.addLayerPanelListeners();
		this.setLayerPviewDim();
	},

	setLayerPviewDim() {
		this.layerPview.width = stage.width;
		this.layerPview.height = stage.height;
	},

	updateLayerPview() {
		this.layerPviewCtx.clearRect(0, 0, stage.width, stage.height);
		this.layerPviewCtx.drawImage(stage.activeLayer.element, 0, 0);
	},

	addLayerPanelListeners() {
		this.newLayerBtn.addEventListener('click', (e) => {
			e.stopPropagation();
			if (this.tileCount > 20) return; //max layers

			stage.newLayer().then((layer) => {
				stage.setActiveLayer(layer);
				statePanel.saveState('newLayer', layer.state);
				autoSave();
			});
		});

		this.layerMenuBtn.addEventListener('shown.bs.dropdown', (e) => {
			_.each(stage.layers, (layer) => layer.updateTilePreview());
		});

		this.renameModalElement.addEventListener('shown.bs.modal', (e) => {
			const currentName = this.renameModalElement.name;
			this.tileRenameInput.placeholder = currentName;
			this.tileRenameInput.focus();
			hotkeys.setScope('modal');
		});

		this.renameModalElement.addEventListener('hide.bs.modal', (e) => {
			this.tileRenameInput.placeholder = '';
			this.tileRenameInput.value = '';
			hotkeys.setScope('stage');
		});

		this.tileRenameForm.addEventListener('submit', (e) => {
			e.preventDefault();
			const layerTile = this.renameModalElement.layerTile;
			const newName = this.tileRenameInput.value;
			layerTile.renameTile(newName);
			this.renameModal.toggle();
			autoSave();
		});
	},
};
