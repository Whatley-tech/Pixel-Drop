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
		this.layerTile = document.createElement('div');
		this.layerTile.id = `tile${id}`;
		this.layerTile.classList.add('tile');
		this.layerTile.addEventListener('click', () => {
			stage.activeLayer = this;
			layerPanel.activeLayerTile = this.layerTile;
			layerPanel.toggleActive();
		});
	}
}
