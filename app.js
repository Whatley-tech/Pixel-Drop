const attachListeners = () => {
	//brush listeners
	stage.element.addEventListener('mousedown', (e) => {
		// pixelCanvas.saveState();
		brush.isDrawing = true;
		brush.drawPixel();
	});
	stage.element.addEventListener('mousemove', (e) => {
		brush.updatePosition(e);
		if (brush.isDrawing) brush.drawPixel();
	});
	stage.element.addEventListener('mouseleave', () => (brush.isDrawing = false));
	stage.element.addEventListener('mouseup', (e) => {
		brush.isDrawing = false;
	});
	//canvasNav Controls
	// newBtn.addEventListener('click', () => {
	// 	removeAllChildNodes(stage);
	// 	canvasRowsInput.value = 0;
	// 	canvasColsInput.value = 0;
	// 	toggleForm();
	// });
	//controls listeners
	// undoBtn.addEventListener('click', () => pixelCanvas.undo());
	// redoBtn.addEventListener('click', () => pixelCanvas.redo());
	brushSizeSlide.addEventListener('input', () => {
		brush.size = brushSizeSlide.value;
	});
};
const removeAllChildNodes = function (parent) {
	while (parent.firstChild) {
		parent.removeChild(parent.firstChild);
	}
};
const toggleHidden = function (element) {
	element.classList.toggle('hidden');
};

const initApp = function () {
	const rows = canvasRowsInput.value;
	const cols = canvasColsInput.value;

	pallet = new Pallet();
	brush = new Brush();

	pallet.initPallet();
	stage.initStage(rows, cols);
	pallet.setCurrentColor();
	attachListeners();
};

const newCanvasForm = document.querySelector('#newCanvasForm');
const undoBtn = document.querySelector('#undo');
const redoBtn = document.querySelector('#redo');
const newBtn = document.querySelector('#newCanvasBtn');
const saveBtn = document.querySelector('#saveCanvasBtn');
const loadBtn = document.querySelector('#loadCanvasBtn');
const brushSizeSlide = document.querySelector('#brushSize');
const canvasRowsInput = document.querySelector('#canvasRowsInput');
const canvasColsInput = document.querySelector('#canvasColsInput');
const stageContainer = document.querySelector('#stageContainer');
const hiddenClass = document.querySelectorAll('.hidden');
let pallet = null;
let pixelCanvas = null;
let brushOverlay = null;
let brush = null;

newCanvasForm.addEventListener('submit', (e) => {
	e.preventDefault();
	toggleHidden(newCanvasForm);
	initApp();
});
