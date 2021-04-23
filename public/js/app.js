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
	clearSessionStorage();
});

_.each(createCanvasBtn, (btn) =>
	btn.addEventListener('click', () => {
		initApp(btn.dataset.width, btn.dataset.height);
		newCanvasModal.toggle();
		clearSessionStorage();
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
	const { prevLayers, prevStage } = checkStorage();
	if (!prevStage) document.querySelector('#newCanvasBtn').click();
	else {
		initApp(prevStage.width, prevStage.height);
		stage.restorePrevSession(prevLayers);
	}
};

const initApp = function (width, height) {
	if (!stage.appIsInit) {
		toolsPanel.init();
		stage.init(parseInt(height), parseInt(width));
		layerPanel.init();
		statePanel.init();
		colorPanel.init();
		colorPanel.selectNewColor();
	} else stage.init(parseInt(height), parseInt(width));
};

const autoSave = function () {
	saveSessionStage();
	saveSessionLayers();
};

const saveSessionLayers = function () {
	const saveData = _.map(stage.layers, (layer) => {
		return {
			name: layer.tile.name,
			zIndex: layer.element.style.zIndex,
			imgDataUri: layer.dataURLImg.src,
			id: layer.id,
		};
	});

	saveSessionItem('layers', saveData);
};

const saveSessionStage = function () {
	saveSessionItem('stage', { width: stage.width, height: stage.height });
};

const saveSessionItem = function (key, data) {
	let storage = window.sessionStorage;
	if (typeof key !== 'string') key = key.stringify();
	if (typeof data !== 'string') data = JSON.stringify(data);

	storage.setItem(key, data);
};

const checkStorage = function () {
	let storage = window.sessionStorage;
	let layers = storage.getItem('layers');
	let stage = storage.getItem('stage');
	prevLayers = JSON.parse(layers);
	prevStage = JSON.parse(stage);
	console.log(prevLayers, prevStage);
	return { prevLayers, prevStage };
};

const clearSessionStorage = function () {
	let storage = window.sessionStorage;
	storage.clear();
};
