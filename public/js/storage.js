const autoSave = function () {
	saveSessionStage();
	saveSessionLayers();
	saveSessionColors();
	saveSessionStates();
	stage.sessionStorage = true;
};

const checkStorage = function () {
	const prevLayers = getSessionItem('layers'),
		prevActiveLayer = getSessionItem('prevActiveLayer'),
		prevStage = getSessionItem('stage'),
		prevColors = getSessionItem('colors'),
		currentColor = getSessionItem('currentColor'),
		undos = getSessionItem('undos'),
		redos = getSessionItem('redos');

	return {
		prevLayers,
		prevActiveLayer,
		prevStage,
		prevColors,
		currentColor,
		undos,
		redos,
	};
};

const saveSessionStates = function () {
	const undos = _.each(statePanel.undoStates, (state) => {
		return { type: state.type, state: state.layerData };
	});

	const redos = _.each(statePanel.redoStates, (state) => {
		return { type: state.type, state: state.layerData };
	});

	saveSessionItem('undos', undos);
	saveSessionItem('redos', redos);
};

const saveSessionLayers = function () {
	const prevActiveLayer = stage.activeLayer.uuid;
	const saveData = _.map(stage.layers, (layer) => {
		return layer.state();
	});

	saveSessionItem('prevActiveLayer', prevActiveLayer);
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

const getSessionItem = function (key) {
	let storage = window.sessionStorage;
	data = storage.getItem(key);
	data = JSON.parse(data);
	return data;
};

const clearSessionStorage = function () {
	let storage = window.sessionStorage;
	storage.clear();
	stage.sessionStorage = false;
};
