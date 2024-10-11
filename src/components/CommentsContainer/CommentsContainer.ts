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
		parentCommentId?: number | null
		repliedToUserName?: string | null
		user: { userName: string; userImg: string }
		rating?: number
	}[]
	private commentCountSpan: HTMLSpanElement | null
	private commentMainButton: HTMLElement | null
	private commentFavorite: HTMLElement | null
	private commentsFavoriteContainer: HTMLDivElement | null
	constructor() {
		this.commentsContainer = document.createElement('div')
		this.commentsContainer.classList.add('comments__container')

		this.commentsActivities = document.createElement('div')
		this.commentsActivities.classList.add('comments__activities')

		this.arrayComments = []

		const activitiesHTML = `
            <button  id="mainComments-btn">Комментарии <span id="comment-count">(${this.arrayComments.length})</span></button>
            <select name="filters" id="filters-select">
                <option value="">Please choose an option</option>
                <option value="popular">По количеству оценок</option>
                <option value="new">Новые</option>
                <option value="old">Старые</option>
            </select>
            <button id="favorite-btn">Избранное <span></span></button>
        `
		//
		this.commentsActivities.innerHTML = activitiesHTML

		this.commentCountSpan =
			this.commentsActivities.querySelector('#comment-count')
		this.commentMainButton =
			this.commentsActivities.querySelector('#mainComments-btn')
		this.commentFavorite =
			this.commentsActivities.querySelector('#favorite-btn')
		this.commentMainButton?.classList.add('--active')
		//

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

		this.commentsFavoriteContainer = document.createElement('div')
		this.commentsFavoriteContainer.classList.add('comments__favorite', 'hidden')

		if (this.commentsFavoriteContainer.innerHTML === '') {
			this.commentsFavoriteContainer.innerHTML = `
				<h3 style='margin-top: 30px'>У вас пока нет избранных комментариев</h3>
			`
		}

		//
		this.commentMainButton?.addEventListener('click', () => {
			this.commentsContent.classList.toggle('hidden')
			this.commentsFavoriteContainer?.classList.add('hidden')
			this.commentMainButton?.classList.toggle('--active')

			if (this.commentMainButton?.classList.contains('--active')) {
				this.commentFavorite?.classList.remove('--active')
			}
		})

		this.commentFavorite?.addEventListener('click', () => {
			this.commentsContent.classList.add('hidden')
			this.commentsFavoriteContainer?.classList.toggle('hidden')
			this.commentFavorite?.classList.toggle('--active')

			if (this.commentFavorite?.classList.contains('--active')) {
				this.commentMainButton?.classList.remove('--active')
			}
		})
		//
		this.commentsContainer.append(this.commentsActivities)
		this.commentsContainer.append(this.commentsFormContainer)
		this.commentsContainer.append(this.commentsContent)
		this.commentsContainer.append(this.commentsFavoriteContainer)
		this.loadCommentsFromStorage()

		form.addEventListener('submit', event => {
			event.preventDefault()
			const commentValue = this.commentInput!.value.trim()
			if (commentValue) {
				const commentExists = this.arrayComments.some(
					comment => comment.text === commentValue
				)
				if (!commentExists) {
					this.createComment(commentValue, user, false, null)
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
		isLocalStorage?: boolean,
		rating: number = 0
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
		ratingCount.textContent = rating.toString()

		const increaseButton = document.createElement('button')
		increaseButton.textContent = '+'

		decreaseButton.addEventListener('click', () => {
			const currentCount = parseInt(ratingCount.textContent || '0')
			const voteStatus = this.getVoteStatus(value)

			if (voteStatus !== 'down') {
				this.updateVoteStatus(value, 'down')
				ratingCount.textContent = Math.max(currentCount - 1, 0).toString()
				const commentIndex = this.arrayComments.findIndex(
					comment => comment.text === value
				)
				this.arrayComments[commentIndex].rating = Math.max(currentCount - 1, 0)
				this.saveCommentsToStorage()
			}
		})

		increaseButton.addEventListener('click', () => {
			const currentCount = parseInt(ratingCount.textContent || '0')
			const voteStatus = this.getVoteStatus(value)

			if (voteStatus !== 'up') {
				this.updateVoteStatus(value, 'up')
				ratingCount.textContent = Math.max(currentCount + 1, 0).toString()
				const commentIndex = this.arrayComments.findIndex(
					comment => comment.text === value
				)
				this.arrayComments[commentIndex].rating = Math.max(currentCount + 1, 0)
				this.saveCommentsToStorage()
			}
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
			const parentIndex = parentComment
				? Array.from(this.commentsContent.children).indexOf(parentComment)
				: null

			this.arrayComments.push({
				text: value,
				isReply: isReply,
				parentCommentId: parentIndex,
				repliedToUserName: repliedToUserName,
				user: userInfo,
				rating: 0,
			})
		}
		console.log(this.arrayComments)
		this.updateAmountOfComment()

		favoriteButton.addEventListener('click', () => {
			const commentHTMLElement = commentElement as HTMLElement

			if (!this.commentsFavoriteContainer) {
				return
			}

			const existingFavoriteComment =
				this.commentsFavoriteContainer.querySelector(
					`[data-id="${commentHTMLElement.dataset.id}"]`
				)

			if (existingFavoriteComment) {
				existingFavoriteComment.remove()
				favoriteButton.textContent = 'В избранное'
			} else {
				const favoriteCommentElement = commentHTMLElement.cloneNode(
					true
				) as HTMLElement
				favoriteCommentElement.dataset.id = commentHTMLElement.dataset.id
				this.commentsFavoriteContainer.append(favoriteCommentElement)
				favoriteButton.textContent = 'В избранном'
			}

			const emptyMessage = this.commentsFavoriteContainer.querySelector('h3')
			if (emptyMessage && this.commentsFavoriteContainer.children.length > 1) {
				emptyMessage.remove()
			}
		})

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
							repliedToUserName
						)
						this.saveCommentsToStorage()
						replyForm.remove()
					}
				})
			}
		})
	}

	private updateVoteStatus(commentText: string, voteType: 'up' | 'down'): void {
		let votes = localStorage.getItem('votes')
		if (!votes) {
			votes = '{}'
		}
		const parsedVotes = JSON.parse(votes)

		parsedVotes[commentText] = voteType
		localStorage.setItem('votes', JSON.stringify(parsedVotes))
	}

	private getVoteStatus(commentText: string): 'up' | 'down' | null {
		const votes = localStorage.getItem('votes')
		if (!votes) return null

		const parsedVotes = JSON.parse(votes)
		return parsedVotes[commentText] || null
	}
	private updateAmountOfComment(): void {
		if (this.commentCountSpan) {
			this.commentCountSpan.textContent = `(${this.arrayComments.length})`
		}
	}

	private saveCommentsToStorage(): void {
		const commentsToSave = this.arrayComments.map(comment => ({
			text: comment.text,
			isReply: comment.isReply,
			parentCommentId: comment.isReply ? comment.parentCommentId : null,
			repliedToUserName: comment.isReply ? comment.repliedToUserName : null,
			user: {
				userName: comment.user.userName,
				userImg: comment.user.userImg,
			},
			rating: comment.rating,
		}))

		localStorage.setItem('comments', JSON.stringify(commentsToSave))
	}

	private loadCommentsFromStorage(): void {
		const savedComments = localStorage.getItem('comments')
		this.arrayComments = []

		if (savedComments) {
			const parsedComments = JSON.parse(savedComments)
			this.arrayComments = parsedComments

			this.arrayComments.forEach(
				({
					text,
					isReply,
					parentCommentId,
					repliedToUserName,
					user,
					rating,
				}) => {
					let parentCommentElement: HTMLDivElement | null = null

					if (isReply && typeof parentCommentId === 'number') {
						const element = this.commentsContent.children[parentCommentId]
						if (element instanceof HTMLDivElement) {
							parentCommentElement = element
						} else {
							console.warn(
								`Parent comment with id ${parentCommentId} not found.`
							)
						}
					}

					this.createComment(
						text,
						user,
						isReply,
						parentCommentElement,
						repliedToUserName,
						true,
						rating
					)

					const currentCommentIndex = this.arrayComments.findIndex(
						comment => comment.text === text
					)

					if (
						currentCommentIndex >= 0 &&
						currentCommentIndex < this.commentsContent.children.length
					) {
						const ratingCountElement = this.commentsContent.children[
							currentCommentIndex
						].querySelector('.comment-activities__count p')

						if (ratingCountElement) {
							ratingCountElement.textContent = rating!.toString()
						} else {
							console.warn('ratingCountElement не найден')
						}
					} else {
						console.warn(
							`Comment index ${currentCommentIndex} is out of bounds.`
						)
					}
				}
			)
		}

		this.updateAmountOfComment()
	}

	public getElement(): HTMLDivElement {
		return this.commentsContainer
	}
}

interface exampleUser {
	userName: string
	userImg: string
}

const exampleUser: exampleUser = {
	userName: 'Алексей_1994b',
	userImg:
		'https://avatars.dzeninfra.ru/get-zen-logos/246004/pub_5ebfd74dec0f7529ba5ece20_5ebfdc39b2e1b32bf1076ca4/xxh',
}
