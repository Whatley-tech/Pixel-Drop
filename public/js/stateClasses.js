class ActionState {
	constructor(type, layerData) {
		this.type = type;
		this.layerData = layerData;
	}
	get layer() {
		const layer = stage.findLayer(this.layerData.uuid, 'uuid');
		return layer;
	}
}
class ToolAction extends ActionState {
	constructor(type, layerData) {
		super(type, layerData);
		this.imgDataUri = layerData.imgDataUri;
	}
	async undo() {
		const currentState = this.layer.state();
		statePanel.saveState('toolAction', currentState, (state) => {
			statePanel.redoStates.push(state);
		});
		await this.layer.renderCanvas(this.imgDataUri);
	}
	async redo() {
		const currentState = this.layer.state();
		statePanel.saveState('toolAction', currentState, (state) => {
			statePanel.undoStates.push(state);
		});
		await this.layer.renderCanvas(this.imgDataUri);
	}
}
class NewLayerAction extends ActionState {
	constructor(type, layerData) {
		super(type, layerData);
	}
	async undo() {
		stage.deleteLayer(this.layerData);
		statePanel.redoStates.push(this);
	}
	async redo() {
		statePanel.undoStates.push(this);
		stage.restoreLayer(this.layerData);
	}
}
class DeleteLayerAction extends ActionState {
	constructor(type, layerData) {
		super(type, layerData);
	}
	async undo() {
		stage.restoreLayer(this.layerData);
		statePanel.redoStates.push(this);
	}
	async redo() {
		stage.deleteLayer(this.layerData);
		statePanel.undoStates.push(this);
	}
}
class ArrangeAction extends ActionState {
	constructor(type, layerData) {
		super(type, layerData);
	}
	async undo() {
		let currentState = this.layer.state();
		statePanel.saveState('arrangeLayer', currentState, (state) => {
			statePanel.redoStates.push(state);
		});
		this.restore();
	}
	async redo() {
		let currentState = this.layer.state();
		statePanel.saveState('arrangeLayer', currentState, (state) => {
			statePanel.undoStates.push(state);
		});
		this.restore();
	}
	restore() {
		const prevIndex = this.layerData.layerIndex;
		const currentIndex = this.layer.layerIndex();
		stage.moveIndex(prevIndex, currentIndex);
		stage.updateZIndexes();
		layerPanel.updateTiles();
	}
}
