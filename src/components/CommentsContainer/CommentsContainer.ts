import './CommentsContainer.scss'
export class CommentsContainer {
	public commentsContainer: HTMLDivElement
	public commentsActivities: HTMLDivElement
	constructor() {
		this.commentsContainer = document.createElement('div')
		this.commentsContainer.classList.add('comments__container')

		this.commentsActivities = document.createElement('div')
		this.commentsActivities.classList.add('comments__activities')

		this.commentsActivities.innerHTML = `
		
		<button class='--active'>Комментарии <span>(80)</span></button>
		<select name="filters" id="filters-select">
  		<option value="">Please choose an option</option>
  		<option value="popular">По количеству оценок</option>
  		<option value="new">Новые</option>
  		<option value="old">Старые</option>
		</select>
		<button>Избранное <span></span></button>
		`

		this.commentsContainer.append(this.commentsActivities)
	}
	public getElement(): HTMLDivElement {
		return this.commentsContainer
	}
}
