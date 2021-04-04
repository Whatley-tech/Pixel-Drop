const newCanvasModal = document.querySelector('#newCanvasModal');
const newCanvasForm = document.querySelector('#newCanvasForm');
const layersDropDownBtn = document.getElementById('layersDropDownBtn');
const layersDropDownMenu = document.getElementById('layersDropDownMenu');
const canvasRowsInput = document.querySelector('#canvasRowsInput');
const canvasColsInput = document.querySelector('#canvasColsInput');

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

newCanvasModal.addEventListener('shown.bs.modal', function () {
	canvasRowsInput.focus();
});

document.addEventListener('mousedown', (e) => {
	if (layersDropDownMenu.classList.contains('show')) layersDropDownBtn.click();
});

const initApp = function () {
	const rows = canvasRowsInput.value;
	const cols = canvasColsInput.value;
	toolsPanel.init();
	stage.init(rows, cols);
	statePanel.init();
	colorPanel.init();
	layerPanel.init();
	colorPanel.selectNewColor();
	enablePopOvers();
	enableToolTips();
};

newCanvasForm.addEventListener('submit', (e) => {
	e.preventDefault();
	$('#newCanvasModal').modal('toggle');
	stage.reset();
	initApp();
	canvasRowsInput.value = null;
	canvasColsInput.value = null;
});

window.onload = () => {
	document.querySelector('#newCanvasBtn').click();
};
