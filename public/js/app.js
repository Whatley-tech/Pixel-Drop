const customCanvasModalElm = document.querySelector('#customCanvasModal'),
	customCanvasModal = new bootstrap.Modal(customCanvasModalElm),
	newCanvasModalElm = document.querySelector('#newCanvasModal'),
	newCanvasModal = new bootstrap.Modal(newCanvasModalElm),
	newCanvasBtn = document.querySelector('#newCanvasBtn'),
	customCanvasForm = document.querySelector('#customCanvasForm'),
	exportCanvasModalElm = document.querySelector('#exportCanvasModal'),
	exportCanvasModal = new bootstrap.Modal(exportCanvasModalElm),
	exportBtn = document.querySelector('#exportBtn'),
	exportDimSlider = document.querySelector('#exportDimSlider'),
	exportDim = document.querySelector('#exportDim'),
	dayNightBtn = document.querySelector('#dayNightBtn'),
	canvasHeightInput = document.querySelector('#canvasHeightInput'),
	canvasWidthInput = document.querySelector('#canvasWidthInput'),
	createCanvasBtn = document.querySelectorAll('.createCanvasBtn');

const tooltipTriggerList = [].slice.call(
	document.querySelectorAll('[data-bs-toggle="tooltip"]')
);

const tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
	return new bootstrap.Tooltip(tooltipTriggerEl);
});

dayNightBtn.addEventListener('click', () => {
	document.body.classList.toggle('bg-dark');
});

customCanvasModalElm.addEventListener('shown.bs.modal', function () {
	canvasWidthInput.focus();
});

newCanvasModalElm.addEventListener('hide.bs.modal', () =>
	hotkeys.setScope('stage')
);
newCanvasModalElm.addEventListener('shown.bs.modal', () =>
	hotkeys.setScope('modal')
);

customCanvasForm.addEventListener('submit', (e) => {
	e.preventDefault();
	clearSessionStorage();
	stage.reset();
	colorPanel.reset();
	customCanvasModal.toggle();
	newCanvasModal.toggle();
	initApp(canvasWidthInput.value, canvasHeightInput.value);
	canvasHeightInput.value = null;
	canvasWidthInput.value = null;
});

_.each(createCanvasBtn, (btn) =>
	btn.addEventListener('click', () => {
		clearSessionStorage();
		stage.reset();
		colorPanel.reset();
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

	if (e.srcElement[1].checked) exportImage('svg', scaleValue);
	if (e.srcElement[2].checked) exportImage('png', scaleValue);
	exportDimSlider.value = 1;
});

//check session storage for saved contents,  reload work if saved contents found
window.onload = () => {
	const {
		prevActiveLayer,
		prevLayers,
		prevStage,
		prevColors,
		currentColor,
		undos,
		redos,
	} = checkStorage();

	if (!prevStage) newCanvasBtn.click();
	else {
		initApp(
			prevStage.width,
			prevStage.height,
			prevStage.lastLayerNum,
			prevLayers,
			prevActiveLayer
		);
		colorPanel.restoreColors(prevColors, currentColor);
		statePanel.restoreStates(undos, redos);
	}
};

const initApp = function (
	width,
	height,
	lastLayerNum,
	prevLayers,
	prevActiveLayer
) {
	if (!stage.appIsInit) {
		toolsPanel.init();
		stage.init(
			parseInt(height),
			parseInt(width),
			parseInt(lastLayerNum),
			prevLayers,
			prevActiveLayer
		);
		layerPanel.init();
		statePanel.init();
		colorPanel.init();
		colorPanel.selectNewColor();
	} else {
		stage.init(parseInt(height), parseInt(width));
	}
};
