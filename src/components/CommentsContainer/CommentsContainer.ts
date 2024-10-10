import './CommentsContainer.scss'
export class CommentsContainer {
	public commentsContainer: HTMLDivElement
	public commentsActivities: HTMLDivElement
	public commentsFormContainer: HTMLDivElement
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

		this.commentsFormContainer = document.createElement('div')
		this.commentsFormContainer.classList.add('comments__form-container')
		this.commentsFormContainer.innerHTML = `
		<div class='comments__user'>
			<img src'#' alt='user1023'/>
		</div>
		<div class='comments__main'>
			<div class='comments__info'>
					<h2>user1023</h2>
					<p>Макс. 1000 символов</p>
			</div>
			<form>
					<input type='text'/>
					<input type='button' value='Отправить'/>
			</form>
		</div>
		`

		this.commentsContainer.append(this.commentsActivities)
		this.commentsContainer.append(this.commentsFormContainer)
	}
	public getElement(): HTMLDivElement {
		return this.commentsContainer
	}
}
