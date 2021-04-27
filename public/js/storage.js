const autoSave = function () {
	saveSessionStage();
	saveSessionLayers();
	saveSessionColors();
	saveSessionStates();
	stage.sessionStorage = true;
	const { undos, redos } = checkStorage();
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
	const saveData = _.map(stage.layers, (layer) => {
		return layer.state();
	});
	const prevActiveLayer = stage.activeLayer.uuid;
	saveSessionItem('layers', saveData);
	saveSessionItem('prevActiveLayer', prevActiveLayer);
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
	const storage = window.sessionStorage;
	let layers = storage.getItem('layers'),
		prevActiveLayer = storage.getItem('prevActiveLayer'),
		stage = storage.getItem('stage'),
		colors = storage.getItem('colors'),
		currentColor = storage.getItem('currentColor'),
		undos = storage.getItem('undos'),
		redos = storage.getItem('redos');

	prevLayers = JSON.parse(layers);
	prevActiveLayer = JSON.parse(prevActiveLayer);
	prevStage = JSON.parse(stage);
	prevColors = JSON.parse(colors);
	currentColor = JSON.parse(currentColor);
	undos = JSON.parse(undos);
	redos = JSON.parse(redos);
	return {
		prevActiveLayer,
		prevLayers,
		prevStage,
		prevColors,
		currentColor,
		undos,
		redos,
	};
};

const clearSessionStorage = function () {
	let storage = window.sessionStorage;
	storage.clear();
	stage.sessionStorage = false;
};
