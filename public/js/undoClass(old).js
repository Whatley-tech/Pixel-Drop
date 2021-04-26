class UndoState {
	constructor(type, layerData) {
		this.type = type;
		this.layerData = layerData;
	}
	get layer() {
		const layer = _.find(stage.layers, (layer) => {
			return layer.uuid === this.layerData.uuid;
		});

		if (!layer) return stage.restoreLayer(this.layerData);
		else return layer;
	}
}
class ActionState extends UndoState {
	constructor(type, layerData) {
		super(type, layerData);
		this.imgDataUri = layerData.imgDataUri;
	}
	async restore() {
		this.layer.clearCanvas();
		await this.layer.renderCanvas(this.imgDataUri);
	}
}
class LayerState extends UndoState {
	constructor(type, layerData) {
		super(type, layerData);
		this.index = layerData.zIndex;
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
class DeleteState extends UndoState {
	constructor(type, layerData) {
		super(type, layerData);
		this.index = layerData.zIndex;
	}
	async restore() {
		return this.layer;
	}
}
class ArrangeState extends UndoState {
	constructor(type, layerData) {
		super(type, layerData);
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
