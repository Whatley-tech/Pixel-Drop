const attachListeners = () => {
	//brush listeners
	stage.element.addEventListener('mousedown', (e) => {
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

	brushSizeSlide.addEventListener('input', () => {
		brush.size = brushSizeSlide.value;
	});
};
const toggleHidden = function (element) {
	element.classList.toggle('hidden');
};

const initApp = function () {
	const rows = canvasRowsInput.value;
	const cols = canvasColsInput.value;

	brush = new Brush();
	colorPanel.init();
	stage.initStage(rows, cols);
	layerPanel.init();
	colorPanel.setCurrentColor();
	attachListeners();
};

const newCanvasForm = document.querySelector('#newCanvasForm');
const brushSizeSlide = document.querySelector('#brushSize');
const canvasRowsInput = document.querySelector('#canvasRowsInput');
const canvasColsInput = document.querySelector('#canvasColsInput');
let brush = undefined;

newCanvasForm.addEventListener('submit', (e) => {
	e.preventDefault();
	toggleHidden(newCanvasForm);
	initApp();
});
