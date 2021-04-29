const templateElm = document.getElementById('tileTemplate');

class LayerTile extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({ mode: 'open' });
		this.shadowRoot.append(templateElm.content.cloneNode(true));
		this.test = { hello: 'world' };
	}
}
customElements.define('layer-tile', LayerTile);
