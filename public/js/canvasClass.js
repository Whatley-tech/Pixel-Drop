class Canvas {
	constructor(uuid, zIndex) {
		//Canvas Element for stage
		this.element = document.createElement('canvas');
		this.ctx = this.element.getContext('2d');
		this.element.dataset.uuid = uuid;
		this.element.width = stage.width;
		this.element.height = stage.height;
		this.element.style.zIndex = zIndex;
		this.element.classList.add('stage-canvas');
		this.visible = true;
	}
	get img() {
		let img = this.ctx.getImageData(0, 0, stage.width, stage.height);
		return img;
	}
	get dataURLImg() {
		let img = new Image();
		img.src = this.element.toDataURL();
		return img;
	}
	clearCanvas() {
		this.ctx.clearRect(0, 0, stage.width, stage.height);
	}
	renderCanvas(img = this.dataURLImg) {
		this.ctx.drawImage(img, 0, 0);
	}
}
class Layer extends Canvas {
	constructor(uuid, zIndex, name) {
		super(uuid, zIndex, name);
		//layerPanel Element
		this.tileContainer = document.querySelector('#tileContainer');
		this.tile = document
			.querySelector(`.tile[data-uuid='template']`)
			.cloneNode(true);
		this.tile.classList.toggle('template');
		this.tileContainer.append(this.tile);
		this.tile.dataset.uuid = uuid;
		this.tile.dataset.name = name;
		this.tile.layerTitle = document.querySelector(
			`.tile[data-uuid='${uuid}'] .layerTitle span`
		);
		this.tile.layerTitle.textContent = name;
		this.tile.visibleBtn = document.querySelector(
			`.tile[data-uuid='${uuid}'] .visibleBtn`
		);
		this.tilePreviewCanvas = document.querySelector(
			`.tile[data-uuid='${uuid}'] canvas`
		);
		this.tilePreviewCanvas.height = stage.height;
		this.tilePreviewCanvas.width = stage.width;
		this.tilePreviewCtx = this.tilePreviewCanvas.getContext('2d');

		//tile controls
		this.tile.removeBtn = document.querySelector(
			`.tile[data-uuid='${uuid}'] .removeBtn`
		);
		this.tile.addEventListener('click', (e) => {
			e.stopPropagation();
			stage.activeLayer = this;
			layerPanel.activeTile = this.tile;
			layerPanel.toggleActive();
		});
		this.tile.removeBtn.addEventListener('click', (e) => {
			e.stopPropagation();
			if (stage.layers.length <= 1) return; //alert here "must have atleast one layer"
			layerPanel.deleteLayer(this);
		});
		this.tile.visibleBtn.addEventListener('click', (e) => {
			e.stopPropagation();
			if (this.visible) {
				this.visible = false;
				this.tile.visibleBtn.innerHTML = `<span class="material-icons md-14">
		visibility_off
		</span>`;
				toggleHidden(this.element);
			} else {
				this.visible = true;
				this.tile.visibleBtn.innerHTML = `<span class="material-icons md-14">
		visibility
		</span>`;
				toggleHidden(this.element);
			}
		});
		this.tile.layerTitle.addEventListener('click', (e) => {
			layerPanel.renameModalElement.dataset.name = this.tile.dataset.name;
		});
	}
	renameTile(newName) {
		this.tile.dataset.name = newName;
		this.tile.layerTitle.textContent = newName;
	}

	updateTilePreview() {
		this.tilePreviewCtx.clearRect(0, 0, stage.height, stage.width);
		this.tilePreviewCtx.drawImage(this.element, 0, 0);
	}

	layerIndex() {
		return _.findIndex(stage.layers, (layer) => {
			return layer === this;
		});
	}
}
