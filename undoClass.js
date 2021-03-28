class UndoState {
	constructor(type, data) {
		this.type = type;
	}
}
class ActionState extends UndoState {
	constructor(type) {
		super(type);
		this.layer = stage.activeLayer;
		this.img = stage.copyImage(stage.activeLayer);
	}
	restore() {
		stage.setActiveLayer(this.layer);
		stage.activeLayer.ctx.putImageData(this.img, 0, 0);
	}
}
class DeleteState extends UndoState {
	constructor(type, data) {
		super(type, data);
		this.data = data;
		this.layer = data;
		this.img = stage.copyImage(this.layer);
		this.index = _.findIndex(stage.layers, this.layer);
	}
	restore() {
		if (_.find(stage.layers, this.layer)) return this.deleteLayer();
		return this.unDeleteLayer();
	}
	deleteLayer() {
		layerPanel.deleteLayer(this.layer);
	}
	unDeleteLayer() {
		stage.restoreLayer(this.layer, this.index, this.img);
	}
}
class ArrangeState extends UndoState {
	constructor(type, data) {
		super(type, data);
		this.data = data;
		this.layerTile = data;
		this.prevIndex = layerPanel.findArrayIndex(stage.layers, (layer) => {
			return layer.tile == this.layerTile;
		});
		this.currentIndex = undefined;
	}
	restore() {
		this.currentIndex = layerPanel.findArrayIndex(stage.layers, (layer) => {
			return layer.tile == this.layerTile;
		});
		stage.moveIndex(this.currentIndex, this.prevIndex);
		layerPanel.updateTiles();
		stage.updateZIndexes();
	}
}
