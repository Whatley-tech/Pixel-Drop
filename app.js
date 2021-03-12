const colorHistory = [];
let currentColor = '#000000';
function setCurrentColor(color) {
	const currentColorDiv = document.querySelector('#currentColor');
	const colorPicker = document.querySelector('#colorPicker');
	colorPicker.value = color;
	currentColorDiv.style.background = color;
	currentColor = color;
}
function updateColorHistory(color) {
	const container = document.querySelector('#colorHistoryContainer');
	const prevColor = document.createElement('div');
	prevColor.style.background = color;
	prevColor.classList.add('prevColor');
	prevColor.addEventListener('click', () => setCurrentColor(color));
	if (container.childNodes.length >= 12) {
		container.removeChild(container.firstChild);
	}

	container.appendChild(prevColor);
	colorHistory.push(prevColor);
}

const currentColorDiv = document.querySelector('#currentColor');
currentColorDiv.addEventListener('click', () => colorPicker.click());

const colorPicker = document.querySelector('#colorPicker');
colorPicker.addEventListener('input', () => setCurrentColor(colorPicker.value));
colorPicker.addEventListener('change', () =>
	updateColorHistory(colorPicker.value)
);

const hideElements = document.querySelectorAll('.hide');
hideElements;

const newCanvasForm = document.querySelector('#newCanvasForm');
//user canvas size input
newCanvasForm.addEventListener('submit', function (e) {
	e.preventDefault();
	const canvasRows = document.querySelector('#canvasRows');
	const canvasCols = document.querySelector('#canvasCols');
	const canvas = new Canvas(canvasRows.value, canvasCols.value);
	const canvasContainer = document.querySelector('#canvasContainer');
	const hiddenClass = document.querySelectorAll('.hidden');
	//clear canvasContainer
	while (canvasContainer.firstChild) {
		canvasContainer.removeChild(canvasContainer.firstChild);
	}
	//initialize blank canvas
	console.dir(canvas);
	canvas.createCanvasElement();
	canvas.initilizeGrid();
	setCurrentColor('#000000');
	// updateColorHistory('#000000');
	for (node of hiddenClass) {
		node.classList.remove('hidden');
	}

	const undoBtn = document.querySelector('#undo');
	const redoBtn = document.querySelector('#redo');

	undoBtn.addEventListener('click', () => canvas.undo());
});
