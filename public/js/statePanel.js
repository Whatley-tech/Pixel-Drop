const statePanel = {
	undoBtn: document.querySelector('#undo'),
	redoBtn: document.querySelector('#redo'),
	undoStates: [],
	redoStates: [],
	init() {
		this.attachStateListeners();
	},
	attachStateListeners() {
		this.undoBtn.addEventListener('click', () => this.undo());
		this.redoBtn.addEventListener('click', () => this.redo());
	},
	saveState(type, layerData, callback) {
		//Types: action,layer,arrange, new?
		let state = {};
		switch (type) {
			case 'toolAction':
				state = new ToolAction(type, layerData);
				break;
			case 'newLayer':
				state = new NewLayerAction(type, layerData);
				break;
			case 'deleteLayer':
				state = new DeleteLayerAction(type, layerData);
				break;
			case 'arrangeLayer':
				state = new ArrangeAction(type, layerData);
				break;
		}

		if (callback) return callback(state);
		this.undoStates.push(state);
	},
	undo() {
		if (!this.undoStates.length) return;

		let state = this.undoStates.pop();
		state.undo();
		stage.updateMergedView();
		layerPanel.updateLayerPview();
		autoSave();
	},
	redo() {
		if (!this.redoStates.length) return;

		let state = this.redoStates.pop();
		state.redo();
		stage.updateMergedView();
		layerPanel.updateLayerPview();
		autoSave();
	},
	clearRedos() {
		_.remove(statePanel.redoStates);
	},
};
