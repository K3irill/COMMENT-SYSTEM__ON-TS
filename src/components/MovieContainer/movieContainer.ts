import { Card } from '../Card/card.ts'
import './movieContainer.scss'
export class MovieContainer {
	private movieContainer: HTMLDivElement
	private cardContainer: HTMLDivElement
	private movieContent: HTMLDivElement
	private descriptionEl: HTMLDivElement
	constructor() {
		this.movieContainer = document.createElement('div')
		this.movieContainer.classList.add('movie__container')

		this.movieContent = document.createElement('div')
		this.movieContent.classList.add('movie__content')

		this.cardContainer = document.createElement('div')
		this.cardContainer.classList.add('card__container')

		this.descriptionEl = document.createElement('div')
		this.descriptionEl.classList.add('movie__description')

		this.movieContent.append(this.cardContainer)
		this.movieContent.append(this.descriptionEl)
		this.movieContainer.append(this.movieContent)
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
