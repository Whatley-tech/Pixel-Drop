class UndoState {
	constructor(type) {
		this.type = type;
	}
}
class ActionState extends UndoState {
	constructor(type) {
		super(type);
		this.layer = stage.activeLayer;
		this.data = stage.copyImage(stage.activeLayer);
	}
	restore() {
		stage.setActiveLayer(this.layer);
		stage.activeLayer.ctx.putImageData(this.data, 0, 0);
	}
}
class DeleteState extends UndoState {
	constructor(type) {
		super(type);
	}
	restore() {}
}
class ArrangeState extends UndoState {
	constructor(type) {
		super(type);
	}
	restore() {}
}
