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
		return _.findIndex(stage.layers, this);
	}

	get state() {
		return {
			uuid: this.uuid,
			zIndex: this.zIndex,
			name: this.name,
			imgDataUri: this.dataUri,
			layerIndex: this.layerIndex,
			tileIndex: this.tileIndex,
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

class Layer extends Canvas {
	constructor(uuid, zIndex, name) {
		super(uuid, zIndex, name);

		this.name = name;

		//create layer-tile element, append, set properties
		this.tileContainer = document.querySelector('#tileContainer');
		this.layerTemplate = document.getElementById('layerTemplate');
		this.layerTile = this.layerTemplate.content.firstElementChild.cloneNode(
			true
		);
		this.tileContainer.append(this.layerTile);
		this.layerTile.name = name;
		this.layerTile.uuid = uuid;
		this.layerTile.stageCanvas = this.element; //reference to related stage canvas

		//select layer-tile elements, set properties
		this.layerTitle = this.layerTile.querySelector('.layerTitle span');
		this.visibleBtn = this.layerTile.querySelector('.visibleBtn');
		this.removeBtn = this.layerTile.querySelector('.removeBtn');
		this.tilePreview = this.layerTile.querySelector('canvas');

		this.tilePreview.height = stage.height;
		this.tilePreview.width = stage.width;
		this.tilePreviewCtx = this.tilePreview.getContext('2d');
		this.layerTitle.textContent = this.name;

		//tile control events
		this.layerTile.addEventListener('click', (e) => {
			e.stopPropagation();
			stage.setActiveLayer(this);
			autoSave();
		});

		this.removeBtn.addEventListener('click', (e) => {
			e.stopPropagation();
			if (stage.layers.length <= 1) return; //must be atleast one layer
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
			layerPanel.renameModalElement.name = this.layerTile.name;
			layerPanel.renameModalElement.layerTile = this;
		});
	}
	get tileIndex() {
		let container = this.tileContainer;
		let children = container.children;
		return _.indexOf(children, this.layerTile);
	}

	renameTile(newName) {
		this.layerTile.name = newName;
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
