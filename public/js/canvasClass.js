class Canvas {
	constructor(uuid, zIndex) {
		//Canvas Element for stage
		this.uuid = uuid;
		this.zIndex = zIndex;
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

	get dataUri() {
		return this.element.toDataURL();
	}

	get layerIndex() {
		return _.findIndex(stage.layers, (layer) => {
			return layer === this;
		});
	}

	get state() {
		return {
			uuid: this.uuid,
			zIndex: this.zIndex,
			name: this.name,
			imgDataUri: this.dataUri,
			layerIndex: this.layerIndex,
		};
	}

	clearCanvas() {
		this.ctx.clearRect(0, 0, stage.width, stage.height);
	}

	renderCanvas(dataUri = this.dataUri) {
		return new Promise((res, rej) => {
			let img = new Image();
			img.onload = () => {
				this.clearCanvas();
				this.ctx.drawImage(img, 0, 0);
				res();
			};
			img.src = dataUri;
		});
	}
}
const templateElm = document.getElementById('tileTemplate');
class LayerTile extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({ mode: 'open' });
		this.shadowRoot.appendChild(templateElm.content.cloneNode(true));
	}
}
customElements.define('layer-tile', LayerTile);

class Layer extends Canvas {
	constructor(uuid, zIndex, name) {
		super(uuid, zIndex, name);
		this.name = name;
		this.uuid = uuid;

		this.tile = document.createElement('layer-tile');
		this.tile = this.tile.shadowRoot.querySelector('.tile');
		this.tile.stageCanvas = this.element; //reference to related stage canvas
		this.tile.layerName = name;
		this.tile.uuid = uuid;
		//layer-tile Element
		this.tileContainer = document.querySelector('#tileContainer');
		this.layerTitle = this.tile.querySelector(`.layerTitle span`);
		this.visibleBtn = this.tile.querySelector(`.visibleBtn`);
		this.removeBtn = this.tile.querySelector(`.removeBtn`);
		this.tilePreview = this.tile.querySelector('canvas');
		this.tileContainer.append(this.tile);
		this.tilePreview.height = stage.height;
		this.tilePreview.width = stage.width;
		this.tilePreviewCtx = this.tilePreview.getContext('2d');
		this.layerTitle.textContent = this.tile.layerName;

		//tile controls
		this.tile.addEventListener('click', (e) => {
			e.stopPropagation();
			stage.activeLayer = this;
			layerPanel.activeTile = this.tile;
			layerPanel.toggleActive();
			autoSave();
		});

		this.removeBtn.addEventListener('click', (e) => {
			e.stopPropagation();
			if (stage.layers.length <= 1) return; //alert here "must have atleast one layer"
			statePanel.saveState('deleteLayer', this.state);
			stage.deleteLayer(this);
		});

		this.visibleBtn.addEventListener('click', (e) => {
			e.stopPropagation();
			if (this.visible) {
				this.visible = false;
				this.visibleBtn.innerHTML = `<span class="material-icons md-14">
		visibility_off
		</span>`;
				toggleHidden(this.element);
			} else {
				this.visible = true;
				this.visibleBtn.innerHTML = `<span class="material-icons md-14">
		visibility
		</span>`;
				toggleHidden(this.element);
			}
		});

		this.layerTitle.addEventListener('click', (e) => {
			layerPanel.renameModalElement.dataset.name = this.tile.layerName;
		});
	}

	renameTile(newName) {
		this.tile.layerName = newName;
		this.layerTitle.textContent = newName;
		this.name = newName;
	}

	updateTilePreview() {
		this.tilePreviewCtx.clearRect(
			0,
			0,
			this.tilePreview.height,
			this.tilePreview.width
		);
		this.tilePreviewCtx.drawImage(this.element, 0, 0);
	}
}
