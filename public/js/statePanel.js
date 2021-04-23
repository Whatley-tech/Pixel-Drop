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
	saveState(type, layer, callback) {
		//Types: action,layer,arrange, new?
		let state = {};
		switch (type) {
			case 'action':
				state = new ActionState(type, layer);
				break;
			case 'layer':
				state = new LayerState(type, layer);
				break;
			case 'arrange':
				state = new ArrangeState(type, layer);
				break;
		}

		if (callback) return callback(state);
		this.undoStates.push(state);
	},
	undo() {
		if (!this.undoStates.length) return;

		const prevState = this.undoStates.pop();
		this.saveState(prevState.type, prevState.layer, (currentState) => {
			this.redoStates.push(currentState);
		});
		prevState.restore();
		stage.updateMergedView();
		layerPanel.updateLayerPview();
		autoSave();
	},
	redo() {
		if (!this.redoStates.length) return;

		const prevState = this.redoStates.pop();
		this.saveState(prevState.type, prevState.layer, (currentState) => {
			this.undoStates.push(currentState);
		});
		prevState.restore();
		stage.updateMergedView();
		layerPanel.updateLayerPview();
		autoSave();
	},
	clearRedos() {
		_.remove(statePanel.redoStates);
	},
};
