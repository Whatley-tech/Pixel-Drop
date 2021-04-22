const customCanvasModalElm = document.querySelector('#customCanvasModal'),
	customCanvasModal = new bootstrap.Modal(customCanvasModalElm),
	newCanvasModalElm = document.querySelector('#newCanvasModal'),
	newCanvasModal = new bootstrap.Modal(newCanvasModalElm),
	customCanvasForm = document.querySelector('#customCanvasForm'),
	exportCanvasModalElm = document.querySelector('#exportCanvasModal'),
	exportCanvasModal = new bootstrap.Modal(exportCanvasModalElm),
	exportBtn = document.querySelector('#exportBtn'),
	exportDimSlider = document.querySelector('#exportDimSlider'),
	exportDim = document.querySelector('#exportDim'),
	canvasHeightInput = document.querySelector('#canvasHeightInput'),
	canvasWidthInput = document.querySelector('#canvasWidthInput'),
	createCanvasBtn = document.querySelectorAll('.createCanvasBtn');

const tooltipTriggerList = [].slice.call(
	document.querySelectorAll('[data-bs-toggle="tooltip"]')
);
const tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
	return new bootstrap.Tooltip(tooltipTriggerEl);
});

customCanvasModalElm.addEventListener('shown.bs.modal', function () {
	canvasWidthInput.focus();
});

customCanvasForm.addEventListener('submit', (e) => {
	e.preventDefault();
	customCanvasModal.toggle();
	newCanvasModal.toggle();
	initApp(canvasWidthInput.value, canvasHeightInput.value);
	canvasHeightInput.value = null;
	canvasWidthInput.value = null;
});

_.each(createCanvasBtn, (btn) =>
	btn.addEventListener('click', () => {
		initApp(btn.dataset.width, btn.dataset.height);
		newCanvasModal.toggle();
	})
);
exportCanvasModalElm.addEventListener('shown.bs.modal', () => {
	exportDim.innerText = `${stage.width}x${stage.height}px`;
});
exportDimSlider.addEventListener('input', (e) => {
	let value = parseInt(exportDimSlider.value);
	exportDim.innerText = `${stage.width * value}x${stage.height * value}px`;
});
exportImageForm.addEventListener('submit', (e) => {
	e.preventDefault();
	exportCanvasModal.toggle();
	let scaleValue = parseInt(exportDimSlider.value);

	if (e.srcElement[1].checked) stage.exportImage('svg', scaleValue);
	if (e.srcElement[2].checked) stage.exportImage('png', scaleValue);
	exportDimSlider.value = 1;
});

//start new canvas on load
window.onload = () => {
	document.querySelector('#newCanvasBtn').click();
};
const initApp = function (width, height) {
	if (!stage.appIsInit) {
		toolsPanel.init();
		stage.init(parseInt(height), parseInt(width));
		statePanel.init();
		colorPanel.init();
		layerPanel.init();
		colorPanel.selectNewColor();
	} else stage.init(parseInt(height), parseInt(width));
};
