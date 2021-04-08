const colorPanel = {
	colorHistory: [],
	currentColor: '#000000',
	colorSelectorDiv: document.querySelector('#colorSelector'),
	newColorDiv: document.querySelector('#newColor'),
	currentColorDiv: document.querySelector('#currentColor'),
	colorPicker: document.querySelector('#colorPicker'),

	init() {
		this.colorSelectorDiv.addEventListener('click', () =>
			this.colorPicker.click()
		);
		this.colorPicker.addEventListener('input', () =>
			this.selectNewColor(this.colorPicker.value)
		);
		this.colorPicker.addEventListener('change', () => {
			this.updateColorHistory(this.colorPicker.value);
			this.setColor(this.colorPicker.value);
		});
	},
	selectNewColor(color = '#000000') {
		this.colorPicker.value = color;
		this.currentColor = color;
		this.newColorDiv.style.background = color;
	},
	setColor(color = this.currentColor) {
		this.currentColorDiv.style.background = color;
	},
	updateColorHistory(color) {
		const container = document.querySelector('#colorHistoryPanel');
		const prevColor = document.createElement('div');

		prevColor.style.background = color;
		prevColor.classList.add('prevColor');
		prevColor.addEventListener('click', () => {
			this.selectNewColor(color);
			this.setColor(color);
		});

		if (container.childNodes.length >= 12) {
			container.removeChild(container.firstChild);
		}

		container.appendChild(prevColor);
		this.colorHistory.push(prevColor);
	},
	rgbToHex(r, g, b) {
		return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
	},
};
