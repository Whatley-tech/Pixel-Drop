document.addEventListener('keydown', (e) => {
	if (e.key == 'z') statePanel.undoBtn.click();
	if (e.key == 'y') statePanel.redoBtn.click();
	if (e.key == 'f') toolsPanel.brushBtn.click();
	if (e.key == 'd') toolsPanel.eraserBtn.click();
	if (e.key == 'v') toolsPanel.moveToolBtn.click();
	if (e.key == 'a') toolsPanel.eyeDropBtn.click();
	if (e.key == 'g') toolsPanel.fillToolBtn.click();
	if (e.key == 'e') {
		toolsPanel.toolSizeSlider.value--;
		toolsPanel.toolSizeSlider.click();
	}
	if (e.key == 'r') {
		toolsPanel.toolSizeSlider.value++;
		toolsPanel.toolSizeSlider.click();
	}
});
