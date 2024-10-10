import './card.scss'
export class Card {
	public cardElement: HTMLElement
	constructor() {
		this.cardElement = document.createElement('div')
		this.cardElement.classList.add('card')
	}
	public getElement(): HTMLElement {
		return this.cardElement
	}
}
