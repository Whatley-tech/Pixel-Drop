const newCanvasForm = document.querySelector('#newCanvasForm');
let pallet = null;
let canvas = null;

//user canvas size input
newCanvasForm.addEventListener('submit', function (e) {
	e.preventDefault();
	const canvasRows = document.querySelector('#canvasRows');
	const canvasCols = document.querySelector('#canvasCols');
	const canvasContainer = document.querySelector('#canvasContainer');
	const hiddenClass = document.querySelectorAll('.hidden');
	pallet = new Pallet();
	canvas = new Canvas(canvasRows.value, canvasCols.value);

	//clear canvasContainer
	while (canvasContainer.firstChild) {
		canvasContainer.removeChild(canvasContainer.firstChild);
	}
	//initialize canvas & Pallet
	console.dir(canvas);
	pallet.initPallet();
	pallet.setCurrentColor('#000000');
	canvas.createCanvasElement();
	canvas.initGrid();
	// console.log(pallet.currentColor);
	//unhide interface
	for (node of hiddenClass) {
		node.classList.remove('hidden');
	}

	const undoBtn = document.querySelector('#undo');
	const redoBtn = document.querySelector('#redo');

	undoBtn.addEventListener('click', () => canvas.undo());
	redoBtn.addEventListener('click', () => canvas.redo());
});

// class Foo {
// 	constructor() {
// 		this.foo = 'foo';
// 	}
// }

// class Bar {
// 	constructor() {
// 		this.bar = 'bar';
// 		this.printFooBar = function () {
// 			console.log(foo.foo + bar.bar);
// 		};
// 	}
// }
// const foo = new Foo();
// const bar = new Bar();
// console.log(bar.printFooBar());
