const attachListeners = () => {
	//brush listeners
	brushCanvas.element.addEventListener('mousedown', (e) => {
		pixelCanvas.saveState();
		brush.isDrawing = true;
		pixelCanvas.drawPixel();
	});
	brushCanvas.element.addEventListener('mousemove', (e) => {
		brush.updatePosition(e);
		if (brush.isDrawing) pixelCanvas.drawPixel();
	});
	brushCanvas.element.addEventListener('mouseup', (e) => {
		brush.isDrawing = false;
	});
	//controls listeners
	undoBtn.addEventListener('click', () => pixelCanvas.undo());
	redoBtn.addEventListener('click', () => pixelCanvas.redo());
	brushSizeSlide.addEventListener('input', () => {
		brush.updateSize(brushSizeSlide.value);
	});
};

const newCanvas = function (rows, cols) {
	pallet = new Pallet();
	pixelCanvas = new Canvas(rows, cols);
	brushCanvas = new Canvas(rows, cols);
	brush = new Brush(pixelCanvas.pixelSize);

	pallet.initPallet();
	pixelCanvas.createCanvasElement('pixelCanvas');
	pixelCanvas.appendCanvasElement();
	brushCanvas.createCanvasElement('brushCanvas');
	brushCanvas.appendCanvasElement();
	pixelCanvas.drawGrid();
	pallet.setCurrentColor();
	brush.updateSize();
	attachListeners();
};

const newCanvasForm = document.querySelector('#newCanvasForm');
const undoBtn = document.querySelector('#undo');
const redoBtn = document.querySelector('#redo');
const newBtn = document.querySelector('#newCanvas');
const saveBtn = document.querySelector('#saveCanvas');
const loadBtn = document.querySelector('#loadCanvas');
const brushSizeSlide = document.querySelector('#brushSize');
const canvasRowsInput = document.querySelector('#canvasRowsInput');
const canvasColsInput = document.querySelector('#canvasColsInput');
const canvasContainer = document.querySelector('#canvasContainer');
const hiddenClass = document.querySelectorAll('.hidden');
let pallet = null;
let pixelCanvas = null;
let brushCanvas = null;
let brush = null;

//user input rows/cols
newCanvasForm.addEventListener('submit', function (e) {
	e.preventDefault();
	const rows = canvasRowsInput.value;
	const cols = canvasColsInput.value;
	//clear canvasContainer
	while (
		canvasContainer.firstChild &&
		canvasContainer.firstChild.id != 'stage'
	) {
		canvasContainer.removeChild(canvasContainer.firstChild);
	}
	//createCanvas
	newCanvas(rows, cols);
	//unhide interface
	for (node of hiddenClass) {
		node.classList.remove('hidden');
	}
});
