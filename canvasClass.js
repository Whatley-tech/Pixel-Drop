class Canvas {
	constructor(id, zIndex) {
		//Canvas Element for stage
		this.element = document.createElement('canvas');
		this.ctx = this.element.getContext('2d');
		this.pixels = [];
		this.element.id = `Layer${id}`;
		this.element.width = stage.width;
		this.element.height = stage.height;
		this.element.style.zIndex = zIndex || id;
		this.element.classList.add('canvas', 'hidden');
		this.visible = true;
	}
}
class Layer extends Canvas {
	constructor(id, zIndex) {
		super(id, zIndex);
		//layerPanel Element
		this.tileContainer = document.querySelector('#tileContainer');
		this.tile = document.querySelector('#tileTemplate').cloneNode(true);
		this.tile.classList.toggle('template');
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

		// toggleHidden(this.tile);

		this.tile.addEventListener('click', (e) => {
			e.stopPropagation();
			stage.activeLayer = this;
			layerPanel.activeTile = this.tile;
			layerPanel.toggleActive();
		});
		$('#renameTileModal').on('shown.bs.modal', function () {
			$(`'#${this.tile.id} .layerTitle'`).trigger('focus');
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
	}
}
