import { makeUserInfo } from '../../user/user'
import './CommentsContainer.scss'

export class CommentsContainer {
	public commentsContainer: HTMLDivElement
	public commentsActivities: HTMLDivElement
	public commentsFormContainer: HTMLDivElement
	public commentsContent: HTMLDivElement
	private commentInput: HTMLInputElement | null
	private commentButton: HTMLInputElement | null

	constructor() {
		this.commentsContainer = document.createElement('div')
		this.commentsContainer.classList.add('comments__container')

		this.commentsActivities = document.createElement('div')
		this.commentsActivities.classList.add('comments__activities')

		const activitiesHTML = `
            <button class='--active'>Комментарии <span>(80)</span></button>
            <select name="filters" id="filters-select">
                <option value="">Please choose an option</option>
                <option value="popular">По количеству оценок</option>
                <option value="new">Новые</option>
                <option value="old">Старые</option>
            </select>
            <button>Избранное <span></span></button>
        `

		this.commentsActivities.innerHTML = activitiesHTML

		this.commentsFormContainer = document.createElement('div')
		this.commentsFormContainer.classList.add('comments__form-container')
		//-----------
		const userDiv = document.createElement('div')
		userDiv.classList.add('comments__user')
		const userImage = document.createElement('img')
		userImage.src = userInfo.userImg
		userImage.alt = userInfo.userName
		userDiv.append(userImage)

		const mainDiv = document.createElement('div')
		mainDiv.classList.add('comments__main')
		const infoDiv = document.createElement('div')
		infoDiv.classList.add('comments__info')
		const usernameH2 = document.createElement('h2')
		usernameH2.textContent = 'Вы'
		const maxLengthP = document.createElement('p')
		maxLengthP.textContent = 'Макс. 1000 символов'
		infoDiv.appendChild(usernameH2)
		infoDiv.appendChild(maxLengthP)

		//-----------
		const form = document.createElement('form')
		form.id = 'comment-form'

		this.commentInput = document.createElement('input')
		this.commentInput.type = 'text'
		this.commentInput.id = 'comment-input'
		this.commentInput.placeholder = 'Ваш комментарий'
		this.commentInput.maxLength = 1000

		this.commentButton = document.createElement('input')
		this.commentButton.type = 'button'
		this.commentButton.id = 'comment-btn'
		this.commentButton.value = 'Отправить'

		//-----------
		form.appendChild(this.commentInput)
		form.appendChild(this.commentButton)

		//-----------
		mainDiv.appendChild(infoDiv)
		mainDiv.appendChild(form)
		this.commentsFormContainer.appendChild(userDiv)
		this.commentsFormContainer.appendChild(mainDiv)

		//-----------
		this.commentsContent = document.createElement('div')
		this.commentsContent.classList.add('comments__content')

		///-----------
		this.commentsContainer.append(this.commentsActivities)
		this.commentsContainer.append(this.commentsFormContainer)
		this.commentsContainer.append(this.commentsContent)

		//-----------
		this.commentButton.addEventListener('click', event => {
			const commentValue = this.commentInput?.value.trim()
			if (commentValue) {
				this.createComment(commentValue)
				if (this.commentInput) {
					this.commentInput.value = ''
				}
			}
		})
	}

	private createComment(value: string): void {
		const commentElement = document.createElement('div')
		commentElement.classList.add('comments__comment')
		commentElement.innerHTML = `
            <div class='comments__user'>
                <img src=${userInfo.userImg} alt=${userInfo.userImg}/>
            </div>
            <div class='comments__main'>
                <div class='comments__info'>
                    <h2>${userInfo.userName}</h2>
                </div>
                <p class='comments__text'>${value}</p>
            </div>
        `
		this.commentsContent.append(commentElement)
	}

	public getElement(): HTMLDivElement {
		return this.commentsContainer
	}
}

const userInfo = makeUserInfo()
