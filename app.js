const toggleHidden = function (element) {
	element.classList.toggle('hidden');
};

const initApp = function () {
	const rows = canvasRowsInput.value;
	const cols = canvasColsInput.value;
	toolsPanel.init();
	stage.init(rows, cols);
	statePanel.init();
	colorPanel.init();
	layerPanel.init();
	colorPanel.setCurrentColor();
};

const newCanvasForm = document.querySelector('#newCanvasForm');
const canvasRowsInput = document.querySelector('#canvasRowsInput');
const canvasColsInput = document.querySelector('#canvasColsInput');

newCanvasForm.addEventListener('submit', (e) => {
	e.preventDefault();
	toggleHidden(newCanvasForm);
	initApp();
});
