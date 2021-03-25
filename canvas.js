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

		//layerPanel Element
		this.tile = document.createElement('div');
		this.tile.name = `tile${id}`;
		this.tile.id = `tile${id}`;
		this.tile.classList.add('tile');
		// this.tile.draggable = 'true';

		this.layerControlContainer = document.createElement('div');
		this.layerControlContainer.id = '#layerControlContainer';

		this.removeBtn = document.createElement('div');
		this.removeBtn.id = '#removeBtn';
		this.removeBtn.classList.add('layerBtn');
		this.removeBtn.innerHTML = `<span class="material-icons md-14 white">
		close
		</span>Tile${id}`;

		this.tile.append(this.layerControlContainer);
		this.layerControlContainer.append(this.removeBtn);

		this.tile.addEventListener('click', () => {
			stage.activeLayer = this;
			layerPanel.activetile = this.tile;
			// console.log(stage.activeLayer);
			layerPanel.toggleActive();
		});
	}
}
