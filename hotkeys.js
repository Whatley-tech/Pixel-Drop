document.addEventListener('keyup', (e) => {
	if (e.ctrlKey == true && e.key == 'z') statePanel.undoBtn.click();
	if (e.ctrlKey == true && e.key == 'y') statePanel.redoBtn.click();
	if (e.key == 'f') toolsPanel.brushBtn.click();
	if (e.key == 'd') toolsPanel.eraserBtn.click();
	if (e.key == 'v') toolsPanel.moveToolBtn.click();
	if (e.key == 'a') toolsPanel.eyeDropBtn.click();
	if (e.key == 'g') toolsPanel.fillToolBtn.click();
	if (e.key == 'e') {
		toolsPanel.brushSizeSlider.value--;
		toolsPanel.brushSizeSlider.click();
	}
	if (e.key == 'r') {
		toolsPanel.brushSizeSlider.value++;
		toolsPanel.brushSizeSlider.click();
	}
});
