const statePanel = {
	undoBtn: document.querySelector('#undo'),
	redoBtn: document.querySelector('#redo'),
	undoStates: [],
	redoStates: [],
	init() {
		this.attachStateListeners();
	},
	attachStateListeners() {
		// this.undoBtn.addEventListener('click', () => this.undo());
		// this.redoBtn.addEventListener('click', () => this.redo());
	},
	saveState() {
		// const state = _.cloneDeep(stage.layers);
		// this.undoStates.push(state);
	},
	undo() {},
	redo() {},
	parseState() {},
};
