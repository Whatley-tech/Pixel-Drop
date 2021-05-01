class ActionState {
	constructor(type, layerData) {
		this.type = type;
		this.layerData = layerData;
	}

	get layer() {
		const layer = stage.findLayer(this.layerData.uuid, 'uuid');
		return layer;
	}

	get currentState() {
		return this.layer.state;
	}
}

class ToolAction extends ActionState {
	constructor(type, layerData) {
		super(type, layerData);
		this.imgDataUri = layerData.imgDataUri;
	}

	async undo() {
		statePanel.saveState('toolAction', this.currentState, (state) => {
			statePanel.redoStates.push(state);
		});
		await this.layer.renderCanvas(this.imgDataUri);
	}

	async redo() {
		statePanel.saveState('toolAction', this.currentState, (state) => {
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
		statePanel.saveState('arrangeLayer', this.currentState, (state) => {
			statePanel.redoStates.push(state);
		});
		this.restore();
	}

	async redo() {
		statePanel.saveState('arrangeLayer', this.currentState, (state) => {
			statePanel.undoStates.push(state);
		});
		this.restore();
	}

	restore() {
		const oldIndex = this.layerData.layerIndex;
		const newIndex = this.layer.layerIndex;
		stage.moveIndex(newIndex, oldIndex);
	}
}
