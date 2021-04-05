class UndoState {
	constructor(type, layer) {
		this.type = type;
		this.layer = layer;
	}
}
class ActionState extends UndoState {
	constructor(type, layer) {
		super(type, layer);

		this.pixels = _.cloneDeep(layer.pixels);
	}
	restore() {
		stage.setActiveLayer(this.layer);
		_.remove(stage.activeLayer.pixels);
		console.log(this.pixels);
		stage.activeLayer.pixels.push(...this.pixels);
		stage.renderCanvas(stage.activeLayer);
	}
}
class DeleteState extends UndoState {
	constructor(type, layer) {
		super(type, layer);

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
		stage.restoreLayer(this.layer, this.index);
	}
}
class ArrangeState extends UndoState {
	constructor(type, layer) {
		super(type, layer);
		this.layerTile = layer.tile;
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
