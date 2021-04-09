const newCanvasModal = document.querySelector('#newCanvasModal');
const newCanvasForm = document.querySelector('#newCanvasForm');
const canvasHeightInput = document.querySelector('#canvasHeightInput');
const canvasWidthInput = document.querySelector('#canvasWidthInput');

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
const percentage = function (num, per) {
	return (num / 100) * per;
};
newCanvasModal.addEventListener('shown.bs.modal', function () {
	canvasWidthInput.focus();
});
const tooltipTriggerList = [].slice.call(
	document.querySelectorAll('[data-bs-toggle="tooltip"]')
);
const tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
	return new bootstrap.Tooltip(tooltipTriggerEl);
});

const initApp = function () {
	const height = canvasHeightInput.value;
	const width = canvasWidthInput.value;
	toolsPanel.init();
	stage.init(height, width);
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
	canvasHeightInput.value = null;
	canvasWidthInput.value = null;
});

//start new canvas on load
window.onload = () => {
	document.querySelector('#newCanvasBtn').click();
};
