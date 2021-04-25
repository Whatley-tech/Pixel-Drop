const autoSave = function () {
	saveSessionStage();
	saveSessionLayers();
	saveSessionColors();
	stage.sessionStorage = true;
	console.log('Auto saved');
	console.log(checkStorage());
};

const saveSessionLayers = function () {
	const saveData = _.map(stage.layers, (layer) => {
		return layer.state();
	});

	saveSessionItem('layers', saveData);
};

const saveSessionColors = function () {
	saveSessionItem('colors', colorPanel.colorHistory);
	saveSessionItem('currentColor', colorPanel.currentColor);
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
	data = JSON.stringify(data);
	storage.setItem(key, data);
};

const checkStorage = function () {
	let storage = window.sessionStorage;
	let layers = storage.getItem('layers');
	let stage = storage.getItem('stage');
	let colors = storage.getItem('colors');
	let currentColor = storage.getItem('currentColor');
	prevLayers = JSON.parse(layers);
	prevStage = JSON.parse(stage);
	prevColors = JSON.parse(colors);
	currentColor = JSON.parse(currentColor);
	return { prevLayers, prevStage, prevColors, currentColor };
};

const clearSessionStorage = function () {
	let storage = window.sessionStorage;
	storage.clear();
	stage.sessionStorage = false;
};
