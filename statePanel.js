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
	saveState(type, data, callback) {
		//Types: action,delete,arrange, new?
		let state = undefined;
		switch (type) {
			case 'action':
				state = new ActionState(type);
				break;
			case 'delete':
				state = new DeleteState(type, data);
				break;
			case 'arrange':
				state = new ArrangeState(type, data);
				break;
		}

		if (callback) return callback(state);
		this.undoStates.push(state);
	},
	undo() {
		if (this.undoStates.length == false) return;

		const prevState = this.undoStates.pop();
		this.saveState(prevState.type, prevState.data, (currentState) => {
			this.redoStates.push(currentState);
		});
		prevState.restore();
	},
	redo() {
		if (this.redoStates.length == false) return;

		const prevState = this.redoStates.pop();
		this.saveState(prevState.type, prevState.data, (currentState) => {
			this.undoStates.push(currentState);
		});
		prevState.restore();
	},
	clearRedos() {
		_.remove(statePanel.redoStates);
	},
};
