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
		this.deletedLayer = data;
		this.img = stage.copyImage(deletedLayer);
	}
	restore() {}
}
class ArrangeState extends UndoState {
	constructor(type) {
		super(type);
	}
	restore() {}
}
