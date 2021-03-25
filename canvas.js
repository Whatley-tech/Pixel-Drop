class Canvas {
	constructor(id, zIndex) {
		//Canvas Element for stage
		this.element = document.createElement('canvas');
		this.ctx = this.element.getContext('2d');
		this.element.id = `canvasLayer${id}`;
		this.element.style.width = `${stage.width}px`;
		this.element.style.height = `${stage.height}px`;
		this.element.width = stage.scaledWidth;
		this.element.height = stage.scaledHeight;
		this.element.style.zIndex = zIndex || id;
		this.element.classList.add('canvas');
		this.ctx.scale(stage.scale, stage.scale);
		this.visible = true;
	}
}
class Layer extends Canvas {
	constructor(id, zIndex) {
		super(id, zIndex);
		//layerPanel Element
		this.tileContainer = document.querySelector('#tileContainer');
		this.tile = document.querySelector('#tileTemplate').cloneNode(true);
		this.tileContainer.append(this.tile);
		this.tile.name = `tile${id}`;
		this.tile.id = `tile${id}`;
		this.tile.layerTitle = document.querySelector(
			`#${this.tile.id} .layerTitle`
		);
		this.tile.layerTitle.innerHTML = `tile${id}`;
		this.tile.visibleBtn = document.querySelector(
			`#${this.tile.id} .visibleBtn`
		);
		this.tile.removeBtn = document.querySelector(`#${this.tile.id} .removeBtn`);

		toggleHidden(this.tile);

		this.tile.addEventListener('click', () => {
			stage.activeLayer = this;
			layerPanel.activetile = this.tile;
			layerPanel.toggleActive();
		});
		this.tile.removeBtn.addEventListener('click', () => {
			_.find(stage.layers, (layer) => {
				if (layer && layer.element === this.element)
					_.remove(stage.layers, layer);
			});
			this.element.remove();
			this.tile.remove();
		});
		this.tile.visibleBtn.addEventListener('click', () => {
			if (this.visible) {
				this.visible = false;
				this.tile.visibleBtn.innerHTML = `<span class="material-icons md-14 white">
		visibility_off
		</span>`;
				toggleHidden(this.element);
			} else {
				this.visible = true;
				this.tile.visibleBtn.innerHTML = `<span class="material-icons md-14 white">
		visibility
		</span>`;
				toggleHidden(this.element);
			}
		});
	}
}
