const toolsPanel = {
	toolsPanel: document.querySelector('#toolsPanel'),
	toolSizeSlider: document.querySelector('#toolSlider'),
	brushBtn: document.querySelector('#brush'),
	eraserBtn: document.querySelector('#eraser'),
	eyeDropBtn: document.querySelector('#eyeDrop'),
	fillToolBtn: document.querySelector('#fillTool'),
	moveToolBtn: document.querySelector('#moveTool'),
	eraser: {},
	brush: {},
	eyeDrop: {},
	moveTool: {},
	activeTool: {},

	init() {
		this.attachToolPanelListeners();
		this.eraser = new Eraser(this.eraserBtn);
		this.brush = new Brush(this.brushBtn);
		this.eyeDrop = new EyeDrop(this.eyeDropBtn);
		this.fillTool = new FillTool(this.fillToolBtn);
		this.moveTool = new MoveTool(this.moveToolBtn);
		this.tool = this.brush;
		this.toggleActive();
	},

	set tool(type) {
		this.activeTool = type;
	},

	attachToolPanelListeners() {
		this.toolSizeSlider.addEventListener('input', () => {
			this.activeTool.size = this.toolSizeSlider.value;
			this.toolSizeSlider.title = this.toolSizeSlider.value;
		});
		this.toolSizeSlider.addEventListener('click', () => {
			this.activeTool.size = this.toolSizeSlider.value;
		});
		this.brushBtn.addEventListener('click', () => {
			this.tool = this.brush;
			this.toolSizeSlider.value = this.activeTool.size;
			this.toggleActive();
		});
		this.eraserBtn.addEventListener('click', () => {
			this.tool = this.eraser;
			this.toolSizeSlider.value = this.activeTool.size;
			this.toggleActive();
		});
		this.eyeDropBtn.addEventListener('click', () => {
			this.tool = this.eyeDrop;
			this.toggleActive();
		});
		this.fillToolBtn.addEventListener('click', () => {
			this.tool = this.fillTool;
			this.toggleActive();
		});
		this.moveToolBtn.addEventListener('click', () => {
			this.tool = this.moveTool;
			this.toggleActive();
		});
	},
	toggleActive() {
		const currentlyActive = document.querySelector('#toolsPanel .active');
		if (currentlyActive) currentlyActive.classList.toggle('active');
		this.activeTool.buttonElement.classList.toggle('active');
	},
};
