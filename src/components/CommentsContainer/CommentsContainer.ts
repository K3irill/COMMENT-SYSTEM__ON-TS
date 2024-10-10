import { makeUserInfo } from '../../user/user'
import './CommentsContainer.scss'

const user = makeUserInfo()
export class CommentsContainer {
	public commentsContainer: HTMLDivElement
	public commentsActivities: HTMLDivElement
	public commentsFormContainer: HTMLDivElement
	public commentsContent: HTMLDivElement
	private commentInput: HTMLInputElement | null
	private commentButton: HTMLInputElement | null
	private arrayComments: {
		text: string
		isReply: boolean
		user: { userName: string; userImg: string }
	}[]
	private commentCountSpan: HTMLSpanElement | null

	constructor() {
		this.commentsContainer = document.createElement('div')
		this.commentsContainer.classList.add('comments__container')

		this.commentsActivities = document.createElement('div')
		this.commentsActivities.classList.add('comments__activities')

		this.arrayComments = []

		const activitiesHTML = `
            <button class='--active'>Комментарии <span id="comment-count">(${this.arrayComments.length})</span ></button>
            <select name="filters" id="filters-select">
                <option value="">Please choose an option</option>
                <option value="popular">По количеству оценок</option>
                <option value="new">Новые</option>
                <option value="old">Старые</option>
            </select>
            <button>Избранное <span></span></button>
        `

		this.commentsActivities.innerHTML = activitiesHTML

		this.commentCountSpan =
			this.commentsActivities.querySelector('#comment-count')

		this.commentsFormContainer = document.createElement('div')
		this.commentsFormContainer.classList.add('comments__form-container')

		const userDiv = document.createElement('div')
		userDiv.classList.add('comments__user')
		const userImage = document.createElement('img')
		userImage.src = user.userImg
		userImage.alt = user.userName
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

		this.loadCommentsFromStorage()

		form.addEventListener('submit', event => {
			event.preventDefault()
			const commentValue = this.commentInput!.value.trim()
			if (commentValue) {
				const commentExists = this.arrayComments.some(
					comment => comment.text === commentValue
				)
				if (!commentExists) {
					this.createComment(commentValue, user, false)
					this.commentInput!.value = ''
					this.saveCommentsToStorage()
				} else {
					console.warn('Комментарий уже существует:', commentValue)
				}
			}
		})
	}

	private createComment(
		value: string,
		userInfo: { userName: string; userImg: string },
		isReply: boolean,
		parentComment?: HTMLDivElement | null,
		repliedToUserName?: string | null,
		isLocalStorage?: boolean
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
		if (isReply) {
			infoDiv.classList.add('comments__info-reply')
		} else {
			infoDiv.classList.add('comments__info')
		}
		const userNameHeading = document.createElement('h2')
		userNameHeading.textContent = userInfo.userName

		infoDiv.append(userNameHeading)

		if (isReply && repliedToUserName) {
			const replyByUserName = document.createElement('p')
			replyByUserName.style.marginLeft = '10px'
			replyByUserName.textContent = `to ${repliedToUserName}`
			infoDiv.append(replyByUserName)
		}

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
		ratingCount.textContent = '0'

		const increaseButton = document.createElement('button')
		increaseButton.textContent = '+'

		decreaseButton.addEventListener('click', () => {
			const currentCount = parseInt(ratingCount.textContent || '0')
			ratingCount.textContent = Math.max(currentCount - 1, 0).toString()
		})
		increaseButton.addEventListener('click', () => {
			const currentCount = parseInt(ratingCount.textContent || '0')
			ratingCount.textContent = Math.max(currentCount + 1, 0).toString()
		})

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
		if (!isLocalStorage) {
			this.arrayComments.push({ text: value, isReply: isReply, user: userInfo })
		}
		this.updateAmountOfComment()
		console.log(this.arrayComments)

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
						const repliedToUserName = userNameHeading.textContent
						this.createComment(
							replyValue,
							user,
							true,
							commentElement,
							repliedToUserName!
						)
						replyInput.value = ''
						this.saveCommentsToStorage()
					}
				})
			}
		})
	}
	private saveCommentsToStorage(): void {
		const commentsToSave = this.arrayComments.map(comment => ({
			text: comment.text,
			isReply: comment.isReply,
			user: {
				userName: comment.user.userName,
				userImg: comment.user.userImg,
			},
		}))

		localStorage.setItem('comments', JSON.stringify(commentsToSave))
	}

	private loadCommentsFromStorage(): void {
		const savedComments = localStorage.getItem('comments')

		this.arrayComments = []

		if (savedComments) {
			const parsedComments = JSON.parse(savedComments)
			this.arrayComments = parsedComments

			this.arrayComments.forEach(({ text, isReply, user }) => {
				if (user && user.userImg && user.userName && isReply !== true) {
					this.createComment(text, user, false, null, null, true)
				} else if (user && user.userImg && user.userName && isReply === true) {
					this.createComment(text, user, true, null, null, true)
				} else {
					console.warn('Данные пользователя неполные для комментария:', text)
				}
			})
		}

		this.updateAmountOfComment()
	}

	private updateAmountOfComment(): void {
		if (this.commentCountSpan) {
			this.commentCountSpan.textContent = `(${this.arrayComments.length})`
		}
	}

	public getElement(): HTMLDivElement {
		return this.commentsContainer
	}
}
// const exampleUser: any = {
// 	userName: 'Алексей_1994b',
// 	userImg:
// 		'https://avatars.dzeninfra.ru/get-zen-logos/246004/pub_5ebfd74dec0f7529ba5ece20_5ebfdc39b2e1b32bf1076ca4/xxh',
// }
