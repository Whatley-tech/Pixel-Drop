const toolsPanel = {
	toolsContainer: document.querySelector('#toolsContainer'),
	brushSizeSlider: document.querySelector('#toolSize'),
	brushBtn: document.querySelector('#brush'),
	eraserBtn: document.querySelector('#eraser'),
	eraser: new Eraser(),
	brush: new Brush(),
	activeTool: undefined,

	init() {
		this.tool = this.brush;
		this.attachToolControlListeners();
	},

	set tool(type) {
		this.activeTool = type;
	},
	attachToolControlListeners() {
		this.brushSizeSlider.addEventListener('input', () => {
			this.activeTool.size = this.brushSizeSlider.value;
		});
		this.brushBtn.addEventListener('click', () => {
			this.tool = this.brush;
			this.brushSizeSlider.value = this.activeTool.size;
		});
		this.eraserBtn.addEventListener('click', () => {
			this.tool = this.eraser;
			this.brushSizeSlider.value = this.activeTool.size;
		});
	},
};
