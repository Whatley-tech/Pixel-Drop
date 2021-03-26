const toolsPanel = {
	toolsContainer: document.querySelector('#toolsContainer'),
	brushSizeSlider: document.querySelector('#toolSize'),
	brushBtn: document.querySelector('#brush'),
	eraserBtn: document.querySelector('#eraser'),
	eyeDropBtn: document.querySelector('#eyeDrop'),
	eraser: undefined,
	brush: undefined,
	eyeDrop: undefined,
	activeTool: undefined,

	init() {
		this.attachToolPanelListeners();
		this.eraser = new Eraser(this.eraserBtn);
		this.brush = new Brush(this.brushBtn);
		this.eyeDrop = new EyeDrop(this.eyeDropBtn);
		this.tool = this.brush;
		this.toggleActive();
	},

	set tool(type) {
		this.activeTool = type;
	},
	attachToolPanelListeners() {
		this.brushSizeSlider.addEventListener('input', () => {
			this.activeTool.size = this.brushSizeSlider.value;
		});
		this.brushBtn.addEventListener('click', () => {
			this.tool = this.brush;
			this.brushSizeSlider.value = this.activeTool.size;
			this.toggleActive();
		});
		this.eraserBtn.addEventListener('click', () => {
			this.tool = this.eraser;
			this.brushSizeSlider.value = this.activeTool.size;
			this.toggleActive();
		});
		this.eyeDropBtn.addEventListener('click', () => {
			this.tool = this.eyeDrop;
			this.brushSizeSlider.value = this.activeTool.size;
			this.toggleActive();
		});
	},
	toggleActive() {
		const currentlyActive = document.querySelector('#toolsContainer .active');
		if (currentlyActive) currentlyActive.classList.toggle('active');
		this.activeTool.buttonElement.classList.toggle('active');
	},
};
