const newCanvasModalElm = document.querySelector('#newCanvasModal'),
	newCanvasModal = new bootstrap.Modal(newCanvasModalElm),
	newCanvasBtn = document.querySelector('#newCanvasBtn'),
	createCanvasBtn = document.querySelectorAll('.createCanvasBtn'),
	customCanvasForm = document.querySelector('#customCanvasForm'),
	customCanvasBtn = document.querySelector('#customCanvasBtn'),
	canvasHeightInput = document.querySelector('#canvasHeightInput'),
	canvasWidthInput = document.querySelector('#canvasWidthInput');

const resetApp = function (width, height) {
	clearSessionStorage();
	stage.reset();
	colorPanel.reset();
	initApp(width, height);
	newCanvasModal.toggle();
};

newCanvasModalElm.addEventListener('hide.bs.modal', () =>
	hotkeys.setScope('stage')
);

newCanvasModalElm.addEventListener('shown.bs.modal', () =>
	hotkeys.setScope('modal')
);

_.each(createCanvasBtn, (btn) =>
	btn.addEventListener('click', () => {
		resetApp(btn.dataset.width, btn.dataset.height);
	})
);

customCanvasForm.addEventListener('submit', (e) => {
	e.preventDefault();
	const width = canvasWidthInput.value;
	const height = canvasHeightInput.value;
	canvasWidthInput.value = '';
	canvasHeightInput.value = '';
	resetApp(width, height);
});
