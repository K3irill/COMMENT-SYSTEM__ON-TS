import { Card } from '../Card/card.ts'

export class MovieContainer {
	private movieContainer: HTMLDivElement
	private cardContainer: HTMLDivElement
	constructor() {
		this.movieContainer = document.createElement('div')
		this.movieContainer.classList.add('movie-container')

		this.cardContainer = document.createElement('div')
		this.cardContainer.classList.add('card-container')

		this.movieContainer.append(this.cardContainer)
		this.generateCards()
	}
	private generateCards() {
		for (let i = 0; i <= 7; i++) {
			const newCard = new Card()
			this.cardContainer.append(newCard.getElement())
		}
	}
	public getElement(): HTMLDivElement {
		return this.movieContainer
	}
}
