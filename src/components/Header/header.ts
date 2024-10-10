import './header.scss'

export class Header {
	public headerElement: HTMLHeadElement
	constructor() {
		this.headerElement = document.createElement('HEADER')
		this.headerElement.classList.add('header')
	}
	public getElement(): HTMLElement {
		return this.headerElement
	}
}
