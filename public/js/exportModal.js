const exportCanvasModalElm = document.querySelector('#exportCanvasModal'),
	exportCanvasModal = new bootstrap.Modal(exportCanvasModalElm),
	exportBtn = document.querySelector('#exportBtn'),
	exportDimSlider = document.querySelector('#exportDimSlider'),
	exportDim = document.querySelector('#exportDim');

exportCanvasModalElm.addEventListener('shown.bs.modal', () => {
	exportDim.innerText = `${stage.width}x${stage.height}px`;
});

exportCanvasModalElm.addEventListener('hide.bs.modal', () => {
	exportDimSlider.value = 1;
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
