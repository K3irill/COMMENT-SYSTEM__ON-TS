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
		infoDiv.append(usernameH2)
		infoDiv.append(maxLengthP)

		const form = document.createElement('form')
		form.id = 'comment-form'

		this.commentInput = document.createElement('input')
		this.commentInput.type = 'text'
		this.commentInput.id = 'comment-input'
		this.commentInput.placeholder = 'Ваш комментарий'
		this.commentInput.maxLength = 1000

		this.commentButton = document.createElement('input')
		this.commentButton.type = 'submit'
		this.commentButton.id = 'comment-btn'
		this.commentButton.value = 'Отправить'

		form.append(this.commentInput)
		form.append(this.commentButton)

		mainDiv.append(infoDiv)
		mainDiv.append(form)
		this.commentsFormContainer.append(userDiv)
		this.commentsFormContainer.append(mainDiv)

		this.commentsContent = document.createElement('div')
		this.commentsContent.classList.add('comments__content')

		this.commentsContainer.append(this.commentsActivities)
		this.commentsContainer.append(this.commentsFormContainer)
		this.commentsContainer.append(this.commentsContent)

		form.addEventListener('submit', event => {
			event.preventDefault()
			const commentValue = this.commentInput!.value.trim()
			if (commentValue) {
				this.createComment(commentValue, false)
				this.commentInput!.value = ''
			}
		})

		this.createComment(
			`Наверное, самая большая ошибка создателей сериала была в том, что они поставили уж слишком много надежд на поддержку фанатов вселенной. Как оказалось на деле, большинство 'фанатов' с самой настоящей яростью и желчью стали уничтожать сериал, при этом объективности в отзывах самый минимум.`,
			false
		)
	}

	private createComment(
		value: string,
		isReply: boolean,
		parentComment?: HTMLDivElement
	): void {
		const commentWrapperInfo = document.createElement('div')
		commentWrapperInfo.classList.add('comments__wrapper-info')

		const commentElement = document.createElement('div')
		commentElement.classList.add('comments__comment')

		if (isReply) {
			commentElement.classList.add('comments__comment--reply')
		}

		const userDiv = document.createElement('div')
		userDiv.classList.add('comments__user')

		const userImg = document.createElement('img')
		userImg.src = userInfo.userImg
		userImg.alt = userInfo.userName
		userDiv.append(userImg)

		const mainDiv = document.createElement('div')
		mainDiv.classList.add('comments__main')

		const infoDiv = document.createElement('div')
		infoDiv.classList.add('comments__info')

		const userNameHeading = document.createElement('h2')
		userNameHeading.textContent = userInfo.userName

		infoDiv.append(userNameHeading)

		const commentText = document.createElement('p')
		commentText.classList.add('comments__text')
		commentText.textContent = value

		const commentActivities = document.createElement('div')
		commentActivities.classList.add('comment__activities', 'comment-activities')

		const replyButton = document.createElement('button')
		replyButton.textContent = 'Ответить'

		if (isReply) {
			replyButton.style.display = 'none'
		}

		const favoriteButton = document.createElement('button')
		favoriteButton.textContent = 'В избранное'

		const ratingDiv = document.createElement('div')
		ratingDiv.classList.add('comment-activities__count')

		const decreaseButton = document.createElement('button')
		decreaseButton.textContent = '-'

		const ratingCount = document.createElement('p')
		ratingCount.textContent = '10'

		const increaseButton = document.createElement('button')
		increaseButton.textContent = '+'

		ratingDiv.append(decreaseButton)
		ratingDiv.append(ratingCount)
		ratingDiv.append(increaseButton)

		commentActivities.append(replyButton)
		commentActivities.append(favoriteButton)
		commentActivities.append(ratingDiv)

		mainDiv.append(infoDiv)
		mainDiv.append(commentText)
		mainDiv.append(commentActivities)

		commentWrapperInfo.append(userDiv)
		commentWrapperInfo.append(mainDiv)

		commentElement.append(commentWrapperInfo)
		if (parentComment) {
			parentComment.appendChild(commentElement)
		} else {
			this.commentsContent.prepend(commentElement)
		}

		replyButton.addEventListener('click', () => {
			let existingReplyForm = mainDiv.querySelector('#reply-form')

			if (existingReplyForm) {
				existingReplyForm.remove()
			} else {
				const replyForm = document.createElement('form')
				replyForm.id = 'reply-form'

				const replyInput = document.createElement('input')
				replyInput.type = 'text'
				replyInput.id = 'reply-input'
				replyInput.placeholder = 'Ваш ответ на комментарий'
				replyInput.maxLength = 1000

				const replySubmitButton = document.createElement('input')
				replySubmitButton.type = 'submit'
				replySubmitButton.id = 'replyComment-btn'
				replySubmitButton.value = 'Отправить'

				replyForm.append(replyInput)
				replyForm.append(replySubmitButton)

				mainDiv.append(replyForm)

				replyForm.addEventListener('submit', event => {
					event.preventDefault()
					const replyValue = replyInput.value.trim()
					if (replyValue) {
						this.createComment(replyValue, true, commentElement)
						replyInput.value = ''
					}
				})
			}
		})
	}

	public getElement(): HTMLDivElement {
		return this.commentsContainer
	}
}

const userInfo = makeUserInfo()
