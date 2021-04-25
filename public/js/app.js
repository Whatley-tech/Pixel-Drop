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
	clearSessionStorage();
	stage.reset();
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

//check session storage for saved contents,  reload work if saved contents found
window.onload = () => {
	const { prevLayers, prevStage } = checkStorage();
	if (!prevStage) document.querySelector('#newCanvasBtn').click();
	else {
		initApp(
			prevStage.width,
			prevStage.height,
			prevStage.lastLayerNum,
			prevLayers
		);
	}
};

const initApp = function (width, height, lastLayerNum) {
	if (!stage.appIsInit) {
		toolsPanel.init();
		stage.init(parseInt(height), parseInt(width), parseInt(lastLayerNum));
		layerPanel.init();
		statePanel.init();
		colorPanel.init();
		colorPanel.selectNewColor();
	} else {
		stage.init(parseInt(height), parseInt(width));
	}
	// autoSave();
};

const autoSave = function () {
	saveSessionStage();
	saveSessionLayers();
	stage.sessionStorage = true;
	console.log('Auto saved');
	console.log(checkStorage());
};

const saveSessionLayers = function () {
	const saveData = _.map(stage.layers, (layer) => {
		return {
			uuid: layer.element.dataset.uuid,
			zIndex: layer.element.style.zIndex,
			name: layer.tile.name,
			imgDataUri: layer.dataURLImg.src,
		};
	});

	saveSessionItem('layers', saveData);
};

const saveSessionStage = function () {
	saveSessionItem('stage', {
		width: stage.width,
		height: stage.height,
		lastLayerNum: stage.lastLayerNum,
	});
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
	return { prevLayers, prevStage };
};

const clearSessionStorage = function () {
	let storage = window.sessionStorage;
	storage.clear();
	stage.sessionStorage = false;
};
