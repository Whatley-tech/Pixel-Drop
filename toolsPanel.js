const toolsPanel = {
	toolsContainer: document.querySelector('#toolsContainer'),
	brushSizeSlider: document.querySelector('#toolSize'),
	brushBtn: document.querySelector('#brush'),
	eraserBtn: document.querySelector('#eraser'),
	eyeDropBtn: document.querySelector('#eyeDrop'),
	fillToolBtn: document.querySelector('#fillTool'),
	moveToolBtn: document.querySelector('#moveTool'),
	eraser: undefined,
	brush: undefined,
	eyeDrop: undefined,
	moveTool: undefined,
	activeTool: undefined,

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
		const currentlyActive = document.querySelector('#toolsContainer .active');
		if (currentlyActive) currentlyActive.classList.toggle('active');
		this.activeTool.buttonElement.classList.toggle('active');
	},
};
