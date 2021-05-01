const dayNightBtn = document.querySelector('#dayNightBtn');

dayNightBtn.addEventListener('click', () => {
	document.body.classList.toggle('bg-dark');
});

const tooltipTriggerList = [].slice.call(
	document.querySelectorAll('[data-bs-toggle="tooltip"]')
);

const tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
	return new bootstrap.Tooltip(tooltipTriggerEl);
});

//check session storage for saved session
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
	//if no storage found, init new session
	if (!prevStage) newCanvasBtn.click();
	//otherwise init app with prev session data
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
	//runs after page load.  Accepts params from prev session if one is detected.
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
		//runs when new canvas is created.  Resets stage with new canvas.
		stage.init(parseInt(height), parseInt(width));
	}
};
