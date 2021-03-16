const attachListeners = () => {
	pixelCanvas.element.addEventListener('click', (e) => {
		brush.paintPixel(e);
	});
	pixelCanvas.element.addEventListener('mousedown', (e) => {
		pixelCanvas.saveState();
		brush.isDrawing = true;
		brush.paintPixel(e);
	});
	pixelCanvas.element.addEventListener('mousemove', (e) => {
		if (brush.isDrawing) brush.paintPixel(e);
	});
	pixelCanvas.element.addEventListener('mouseup', (e) => {
		brush.isDrawing = false;
	});
	brushCanvas.element.addEventListener('mousemove', (e) => {
		brush.updatePosition(e);
	});
};

const newCanvasForm = document.querySelector('#newCanvasForm');
let pallet = null;
let pixelCanvas = null;
let brushCanvas = null;
let brush = null;

//user pixelCanvas size input
newCanvasForm.addEventListener('submit', function (e) {
	e.preventDefault();
	const canvasRows = document.querySelector('#canvasRows');
	const canvasCols = document.querySelector('#canvasCols');
	const canvasContainer = document.querySelector('#canvasContainer');
	const hiddenClass = document.querySelectorAll('.hidden');
	pallet = new Pallet();
	pixelCanvas = new Canvas(canvasRows.value, canvasCols.value);
	brushCanvas = new Canvas(canvasRows.value, canvasCols.value);
	brush = new Brush(pixelCanvas.pixelSize);

	//clear canvasContainer
	while (
		canvasContainer.firstChild &&
		canvasContainer.firstChild.id != 'stage'
	) {
		console.log(canvasContainer.firstChild);
		canvasContainer.removeChild(canvasContainer.firstChild);
	}
	//initialize pixelCanvas // Pallet //brush

	pallet.initPallet();
	pallet.setCurrentColor();
	pixelCanvas.createCanvasElement('pixelCanvas');
	brushCanvas.createCanvasElement('brushCanvas');
	pixelCanvas.appendCanvasElement();
	brushCanvas.appendCanvasElement();
	pixelCanvas.initGrid();
	brush.updateSize();
	attachListeners();

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
	undoBtn.addEventListener('click', () => pixelCanvas.undo());
	redoBtn.addEventListener('click', () => pixelCanvas.redo());
	brushSize.addEventListener('input', () => {
		brush.updateSize(brushSize.value);
	});
});
