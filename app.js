const customCanvasModalElm = document.querySelector('#customCanvasModal'),
	customCanvasModal = new bootstrap.Modal(customCanvasModalElm),
	newCanvasModalElm = document.querySelector('#newCanvasModal'),
	newCanvasModal = new bootstrap.Modal(newCanvasModalElm),
	customCanvasForm = document.querySelector('#customCanvasForm'),
	saveCanvasModalElm = document.querySelector('#saveCanvasModal'),
	saveCanvasModal = new bootstrap.Modal(saveCanvasModalElm),
	imgDimSlide = document.querySelector('#imageDimSlide'),
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
	initApp(parseInt(canvasWidthInput.value), parseInt(canvasHeightInput.value));
	canvasHeightInput.value = null;
	canvasWidthInput.value = null;
});

_.each(createCanvasBtn, (btn) =>
	btn.addEventListener('click', () => {
		initApp(parseInt(btn.dataset.width), parseInt(btn.dataset.height));
		newCanvasModal.toggle();
	})
);
saveCanvasModalElm.addEventListener('shown.bs.modal', () => {
	exportDim.innerText = `${stage.width}x${stage.height}`;
});
imgDimSlide.addEventListener('input', (e) => {
	console.log(e);
	let value = parseInt(imgDimSlide.value);
	exportDim.innerText = `${stage.width + value}x${stage.height + value}`;
});

//start new canvas on load
window.onload = () => {
	document.querySelector('#newCanvasBtn').click();
};
const initApp = function (width, height) {
	toolsPanel.init();
	stage.init(height, width);
	statePanel.init();
	colorPanel.init();
	layerPanel.init();
	colorPanel.selectNewColor();
};
