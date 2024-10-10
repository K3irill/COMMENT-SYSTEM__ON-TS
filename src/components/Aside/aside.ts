export class Aside {
	public asideElement: HTMLElement
	constructor() {
		this.asideElement = document.createElement('aside')
		this.asideElement.classList.add('aside')
	}
	public getElement(): HTMLElement {
		return this.asideElement
	}
}
