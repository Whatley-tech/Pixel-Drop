const toolsPanel = {
	toolsContainer: document.querySelector('#toolsContainer'),
	brushSizeSlider: document.querySelector('#toolSize'),
	brushBtn: document.querySelector('#brush'),
	eraserBtn: document.querySelector('#eraser'),
	eraser: undefined,
	brush: undefined,
	activeTool: undefined,

	init() {
		this.attachToolControlListeners();
		this.eraser = new Eraser(this.eraserBtn);
		this.brush = new Brush(this.brushBtn);
		this.tool = this.brush;
		this.toggleActive();
		console.log(this.eraser);
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
			this.toggleActive();
		});
		this.eraserBtn.addEventListener('click', () => {
			this.tool = this.eraser;
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
