const newCanvasForm = document.querySelector('#newCanvasForm');
let pallet = null;
let canvas = null;
let brush = null;

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
	pallet.initPallet();
	pallet.setCurrentColor();
	canvas.createCanvasElement();
	canvas.initGrid();

	//unhide interface
	for (node of hiddenClass) {
		node.classList.remove('hidden');
	}

	const undoBtn = document.querySelector('#undo');
	const redoBtn = document.querySelector('#redo');
	const newBtn = document.querySelector('#newCanvas');
	const saveBtn = document.querySelector('#saveCanvas');
	const loadBtn = document.querySelector('#loadCanvas');
	const brushSize = document.querySelector('#brushSize');
	undoBtn.addEventListener('click', () => canvas.undo());
	redoBtn.addEventListener('click', () => canvas.redo());
	brushSize.addEventListener('input', () => {
		canvas.updateBrushSize(brushSize.value);
	});
});
