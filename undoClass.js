class UndoState {
	constructor(type, layer) {
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
	constructor(type, layer) {
		super(type, layer);
		this.layer = layer;
		this.img = stage.copyImage(this.layer);
		this.index = _.findIndex(stage.layers, layer);
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
	constructor(type, layer) {
		super(type, layer);
	}
	restore() {}
}
