class Canvas {
	constructor(id, zIndex) {
		this.element = document.createElement('canvas');
		this.ctx = this.element.getContext('2d');
		this.element.id = id;
		this.element.style.width = `${stage.width}px`;
		this.element.style.height = `${stage.height}px`;
		this.element.width = stage.scaledWidth;
		this.element.height = stage.scaledHeight;
		this.element.style.zIndex = zIndex;
		this.element.classList.add('canvas');
		this.ctx.scale(stage.scale, stage.scale);
	}
}

// 	get state() {
// 		return this.ctx.getImageData(0, 0, this.scaledWidth, this.scaledHeight);
// 	}
// 	drawState(img) {
// 		this.ctx.putImageData(img, 0, 0);
// 	}

// 	saveState() {
// 		_.remove(this.redoStates);
// 		const currentState = this.state;
// 		this.undoStates.push(currentState);
// 		console.log(`undos: ${this.undoStates}, redos: ${this.redoStates}`);
// 	}

// 	undo() {
// 		try {
// 			let currentState = this.getState();
// 			let lastState = this.undoStates.pop();
// 			this.redoStates.push(currentState);
// 			this.drawState(lastState);
// 			console.log(`undos: ${this.undoStates}, redos: ${this.redoStates}`);
// 		} catch {
// 			console.log('Error: There are no more undo states!');
// 		}
// 	}

// 	redo() {
// 		try {
// 			const state = this.redoStates.pop();
// 			this.drawState(state);
// 			this.undoStates.push(state);
// 			console.log(`undos: ${this.undoStates}, redos: ${this.redoStates}`);
// 		} catch {
// 			console.log('Error: There are no more redo states!');
// 		}
// 	}
// }
