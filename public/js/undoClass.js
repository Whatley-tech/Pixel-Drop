class ActionState {
	constructor(type, layerData) {
		this.type = type;
		this.layerData = layerData;
	}
	get layer() {
		const layer = _.find(stage.layers, (layer) => {
			return layer.uuid === this.layerData.uuid;
		});
		return layer;
	}
}
class ToolAction extends ActionState {
	constructor(type, layerData) {
		super(type, layerData);
		this.imgDataUri = layerData.imgDataUri;
	}
	undo() {
		let currentState = this.layer.state();
		statePanel.saveState('toolAction', currentState, (state) => {
			statePanel.redoStates.push(state);
		});
		this.layer.clearCanvas();
		this.layer.renderCanvas(this.imgDataUri);
	}
	redo() {
		let currentState = this.layer.state();
		statePanel.saveState('toolAction', currentState, (state) => {
			statePanel.undoStates.push(state);
		});
		this.layer.renderCanvas(this.imgDataUri);
	}
}
class NewLayerAction extends ActionState {
	constructor(type, layerData) {
		super(type, layerData);
	}
	undo() {
		stage.deleteLayer(this.layerData);
		statePanel.redoStates.push(this);
	}
	redo() {
		statePanel.undoStates.push(this);
		stage.restoreLayer(this.layerData);
	}
}
class DeleteLayerAction extends ActionState {
	constructor(type, layerData) {
		super(type, layerData);
	}
	undo() {
		stage.restoreLayer(this.layerData);
		statePanel.redoStates.push(this);
	}
	redo() {
		stage.deleteLayer(this.layerData);
		statePanel.undoStates.push(this);
	}
}
class ArrangeAction extends ActionState {
	constructor(type, layerData) {
		super(type, layerData);
	}
	undo() {
		let currentState = this.layer.state();
		statePanel.saveState('arrangeLayer', currentState, (state) => {
			statePanel.redoStates.push(state);
		});
		const prevIndex = this.layerData.layerIndex;
		const currentIndex = this.layer.layerIndex();
		stage.moveIndex(prevIndex, currentIndex);
		stage.updateZIndexes();
		layerPanel.updateTiles();
	}
	redo() {
		let currentState = this.layer.state();
		statePanel.saveState('arrangeLayer', currentState, (state) => {
			statePanel.undoStates.push(state);
		});
		const prevIndex = this.layerData.layerIndex;
		const currentIndex = this.layer.layerIndex();
		stage.moveIndex(prevIndex, currentIndex);
		stage.updateZIndexes();
		layerPanel.updateTiles();
	}
}
