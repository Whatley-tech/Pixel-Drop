const attachListeners = () => {
	//brush listeners
	brushOverlay.element.addEventListener('mousedown', (e) => {
		pixelCanvas.saveState();
		brush.isDrawing = true;
		pixelCanvas.drawPixel();
	});
	brushOverlay.element.addEventListener('mousemove', (e) => {
		brush.updatePosition(e);
		if (brush.isDrawing) pixelCanvas.drawPixel();
	});
	brushOverlay.element.addEventListener(
		'mouseleave',
		() => (brush.isDrawing = false)
	);
	brushOverlay.element.addEventListener('mouseup', (e) => {
		brush.isDrawing = false;
	});
	//canvasNav Controls
	newBtn.addEventListener('click', () => {
		removeAllChildNodes(stage);
		canvasRowsInput.value = 0;
		canvasColsInput.value = 0;
		toggleForm();
	});
	//controls listeners
	undoBtn.addEventListener('click', () => pixelCanvas.undo());
	redoBtn.addEventListener('click', () => pixelCanvas.redo());
	brushSizeSlide.addEventListener('input', () => {
		brush.updateSize(brushSizeSlide.value);
	});
};
const removeAllChildNodes = function (parent) {
	while (parent.firstChild) {
		parent.removeChild(parent.firstChild);
	}
};
const toggleForm = function () {
	console.log('hide');
	newCanvasForm.classList.toggle('hidden');
};

const initCanvas = function () {
	const rows = canvasRowsInput.value;
	const cols = canvasColsInput.value;

	pallet = new Pallet();
	pixelCanvas = new Canvas(rows, cols);
	brushOverlay = new Canvas(rows, cols);
	brush = new Brush(pixelCanvas.pixelSize);

	pallet.initPallet();
	pixelCanvas.createCanvasElement('pixelCanvas');
	pixelCanvas.appendCanvasElement();
	brushOverlay.createCanvasElement('brushOverlay');
	brushOverlay.appendCanvasElement();
	pixelCanvas.drawGrid();
	pallet.setCurrentColor();
	brush.updateSize();
	attachListeners();
};
const stage = document.querySelector('#stage');
const newCanvasForm = document.querySelector('#newCanvasForm');
const undoBtn = document.querySelector('#undo');
const redoBtn = document.querySelector('#redo');
const newBtn = document.querySelector('#newCanvasBtn');
const saveBtn = document.querySelector('#saveCanvasBtn');
const loadBtn = document.querySelector('#loadCanvasBtn');
const brushSizeSlide = document.querySelector('#brushSize');
const canvasRowsInput = document.querySelector('#canvasRowsInput');
const canvasColsInput = document.querySelector('#canvasColsInput');
const canvasContainer = document.querySelector('#canvasContainer');
const hiddenClass = document.querySelectorAll('.hidden');
let pallet = null;
let pixelCanvas = null;
let brushOverlay = null;
let brush = null;

newCanvasForm.addEventListener('submit', (e) => {
	e.preventDefault();
	toggleForm();
	initCanvas();
});
