const colorPanel = {
	colorHistory: [],
	currentColor: '#000000',
	currentColorDiv: document.querySelector('#currentColor'),
	colorPicker: document.querySelector('#colorPicker'),

	init() {
		this.currentColorDiv.addEventListener('click', () =>
			this.colorPicker.click()
		);
		this.colorPicker.addEventListener('input', () =>
			this.setCurrentColor(this.colorPicker.value)
		);
		this.colorPicker.addEventListener('change', () =>
			this.updateColorHistory(this.colorPicker.value)
		);
	},
	setCurrentColor(color = '#000000') {
		this.colorPicker.value = color;
		this.currentColorDiv.style.background = color;
		this.currentColor = color;
	},
	updateColorHistory(color) {
		const container = document.querySelector('#colorHistoryContainer');
		const prevColor = document.createElement('div');

		prevColor.style.background = color;
		prevColor.classList.add('prevColor');
		prevColor.addEventListener('click', () => {
			this.setCurrentColor(color);
		});

		if (container.childNodes.length >= 12) {
			container.removeChild(container.firstChild);
		}

		container.appendChild(prevColor);
		this.colorHistory.push(prevColor);
	},
};
