const enableToolTips = function () {
	$(function () {
		$('[data-toggle="tooltip"]').tooltip();
	});
};
const enablePopOvers = function () {
	$(function () {
		$('[data-toggle="popover"]').popover();
	});
};
const toggleHidden = function (element) {
	element.classList.toggle('hidden');
};
$('#newCanvasModal').on('shown.bs.modal', function () {
	$('#newCanvasBtn').trigger('focus');
});

const initApp = function () {
	const rows = canvasRowsInput.value;
	const cols = canvasColsInput.value;
	toolsPanel.init();
	stage.init(rows, cols);
	statePanel.init();
	colorPanel.init();
	layerPanel.init();
	colorPanel.setCurrentColor();
	enablePopOvers();
	enableToolTips();
};

const newCanvasForm = document.querySelector('#newCanvasForm');
const canvasRowsInput = document.querySelector('#canvasRowsInput');
const canvasColsInput = document.querySelector('#canvasColsInput');

newCanvasForm.addEventListener('submit', (e) => {
	e.preventDefault();
	$('#newCanvasModal').modal('toggle');
	// toggleHidden(newCanvasForm);
	stage.reset();
	initApp();
});
