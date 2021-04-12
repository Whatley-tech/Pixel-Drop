const customCanvasModal = document.querySelector('#customCanvasModal');
const newCanvasForm = document.querySelector('#newCanvasForm');
const canvasHeightInput = document.querySelector('#canvasHeightInput');
const canvasWidthInput = document.querySelector('#canvasWidthInput');
const createCanvasBtn = document.querySelectorAll('.createCanvasBtn');

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
customCanvasModal.addEventListener('shown.bs.modal', function () {
	canvasWidthInput.focus();
});
const tooltipTriggerList = [].slice.call(
	document.querySelectorAll('[data-bs-toggle="tooltip"]')
);
const tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
	return new bootstrap.Tooltip(tooltipTriggerEl);
});

const initApp = function (width, height) {
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
	$('#customCanvasModal').modal('toggle');
	stage.reset();
	initApp(canvasWidthInput.value, canvasHeightInput.value);
	canvasHeightInput.value = null;
	canvasWidthInput.value = null;
});

_.each(createCanvasBtn, (btn) =>
	btn.addEventListener('click', () => {
		initApp(btn.dataset.width, btn.dataset.height);
	})
);

//start new canvas on load
window.onload = () => {
	document.querySelector('#newCanvasBtn').click();
};
