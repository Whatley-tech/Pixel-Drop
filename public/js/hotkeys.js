hotkeys('z', 'stage', () => statePanel.undoBtn.click());
hotkeys('y', 'stage', () => statePanel.redoBtn.click());
hotkeys('f', 'stage', () => toolsPanel.brushBtn.click());
hotkeys('d', 'stage', () => toolsPanel.eraserBtn.click());
hotkeys('v', 'stage', () => toolsPanel.moveToolBtn.click());
hotkeys('a', 'stage', () => toolsPanel.eyeDropBtn.click());
hotkeys('g', 'stage', () => toolsPanel.fillToolBtn.click());
hotkeys('e', 'stage', () => {
	toolsPanel.toolSizeSlider.value--;
	toolsPanel.toolSizeSlider.click();
});
hotkeys('r', 'stage', () => {
	toolsPanel.toolSizeSlider.value++;
	toolsPanel.toolSizeSlider.click();
});

hotkeys('*', 'modal', () => {});
