import { createNewUser, makeUserInfo, switchUser } from '../../user/user'
import './CommentsContainer.scss'

const user = makeUserInfo()

interface Comment {
	text: string
	isReply: boolean
	isFavorite: boolean
	parentCommentId: number | null | undefined
	repliedToUserName: string | null | undefined
	user: { userName: string; userImg: string }
	rating: number
	commentId: number
	date: Date
	repliesArr: Comment[]
}

export class CommentsContainer {
	public commentsContainer: HTMLDivElement
	public commentsActivities: HTMLDivElement
	public commentsFormContainer: HTMLDivElement
	public commentsListOfComments: HTMLDivElement
	private commentInput: HTMLInputElement | null
	private commentButton: HTMLInputElement | null
	private arrayComments: Comment[] = []
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
								<option value="main">По умолчанию</option>
                <option value="rating">По количеству оценок</option>
                <option value="old">По актуальности(убывание)</option>
                <option value="new">По актуальности(возрастание)</option>
                <option value="amountReplies">По количеству ответов</option>
            </select>
            <button id="favorite-btn">Избранное <span></span></button>
							<div class='admin'>
							<p style='color: red'>ДЛЯ ТЕСТА</p>
							<button id='switch-user'>Переключиться между пользователями</button> 						  
							<button id='create-user'>Новый пользователь</button>
						</div>
						
        `
		//switchUser
		this.commentsActivities.innerHTML = activitiesHTML

		const switchUserBtn = this.commentsActivities.querySelector('#switch-user')
		switchUserBtn?.addEventListener('click', () => {
			switchUser()
		})
		const createUserBtn = this.commentsActivities.querySelector('#create-user')
		createUserBtn?.addEventListener('click', () => {
			createNewUser()
		})

		this.commentCountSpan =
			this.commentsActivities.querySelector('#comment-count')
		this.commentMainButton =
			this.commentsActivities.querySelector('#mainComments-btn')
		this.commentFavorite =
			this.commentsActivities.querySelector('#favorite-btn')
		this.commentMainButton?.classList.add('--active')
		//
		const filtersSelect =
			this.commentsActivities.querySelector('#filters-select')
		filtersSelect?.addEventListener('change', event => {
			const selectedOption = (event.target as HTMLSelectElement).value
			this.sortComments(selectedOption)
		})

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

		this.commentsListOfComments = document.createElement('div')
		this.commentsListOfComments.classList.add('comments__list-of-comments')

		this.commentsFavoriteContainer = document.createElement('div')
		this.commentsFavoriteContainer.classList.add('comments__favorite', 'hidden')

		if (this.commentsFavoriteContainer.innerHTML === '') {
			this.commentsFavoriteContainer.innerHTML = `
				<h3 style='margin-top: 30px'>У вас пока нет избранных комментариев</h3>
			`
		}

		//
		this.commentMainButton?.addEventListener('click', () => {
			this.commentsListOfComments.classList.toggle('hidden')
			this.commentsFavoriteContainer?.classList.add('hidden')
			this.commentMainButton?.classList.toggle('--active')

			if (this.commentMainButton?.classList.contains('--active')) {
				this.commentFavorite?.classList.remove('--active')
			}
		})

		this.commentFavorite?.addEventListener('click', () => {
			this.commentsListOfComments.classList.add('hidden')
			this.commentsFavoriteContainer?.classList.toggle('hidden')
			this.commentFavorite?.classList.toggle('--active')

			if (this.commentFavorite?.classList.contains('--active')) {
				this.commentMainButton?.classList.remove('--active')
			}
		})
		//
		this.commentsContainer.append(this.commentsActivities)
		this.commentsContainer.append(this.commentsFormContainer)
		this.commentsContainer.append(this.commentsListOfComments)
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
					this.createComment(
						commentValue,
						user,
						false,
						false,
						null,
						null,
						false,
						0,
						Date.now()
					)
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
		isFavorite: boolean,
		parentComment?: HTMLDivElement | null,
		repliedToUserName?: string | null,
		isLocalStorage?: boolean,
		rating: number = 0,
		commentId: number = Date.now(),
		date?: Date | string
	): any {
		const commentWrapperInfo = document.createElement('div')
		commentWrapperInfo.classList.add('comments__wrapper-info')

		const commentElement = document.createElement('div')
		commentElement.setAttribute('by-comment-id', commentId.toString())

		if (isReply) {
			commentElement.classList.add('comments__comment--reply')
		} else {
			commentElement.classList.add('comments__content')
			commentElement.id = `comment-${commentId}`
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
		infoDiv.classList.add(isReply ? 'comments__info-reply' : 'comments__info')

		const userNameHeading = document.createElement('h2')
		userNameHeading.classList.add('heading')
		userNameHeading.textContent = userInfo.userName

		const currentDate =
			date instanceof Date ? date : date ? new Date(date) : new Date()

		const timeAndDateComment = document.createElement('p')
		timeAndDateComment.style.fontSize = '14px'
		timeAndDateComment.textContent = `${currentDate.getDate()}.${
			currentDate.getMonth() + 1
		}.${currentDate
			.getFullYear()
			.toString()
			.substr(-2)} ${currentDate.getHours()}:${
			currentDate.getMinutes() < 10
				? '0' + currentDate.getMinutes()
				: currentDate.getMinutes()
		}`

		infoDiv.append(userNameHeading)

		if (isReply && repliedToUserName) {
			const replyByUserName = document.createElement('p')
			replyByUserName.style.marginLeft = '10px'
			replyByUserName.textContent = `to ${repliedToUserName}`
			timeAndDateComment.style.marginLeft = '10px'
			infoDiv.append(replyByUserName)
			infoDiv.append(timeAndDateComment)
		} else {
			infoDiv.append(timeAndDateComment)
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
		if (isFavorite) {
			favoriteButton.textContent = 'В избранном'
			favoriteButton.style.color = '#aa2222'
		} else {
			favoriteButton.textContent = 'В избранное'
			favoriteButton.style.color = 'white'
		}

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
				ratingCount.textContent = (currentCount - 1).toString()
				const commentIndex = this.arrayComments.findIndex(
					comment => comment.text === value
				)
				this.arrayComments[commentIndex].rating = currentCount - 1
				this.saveCommentsToStorage()
			}
		})

		increaseButton.addEventListener('click', () => {
			const currentCount = parseInt(ratingCount.textContent || '0')
			const voteStatus = this.getVoteStatus(value)

			if (voteStatus !== 'up') {
				this.updateVoteStatus(value, 'up')
				ratingCount.textContent = (currentCount + 1).toString()
				const commentIndex = this.arrayComments.findIndex(
					comment => comment.text === value
				)
				this.arrayComments[commentIndex].rating = currentCount + 1
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

		const commentReplies = document.createElement('div')
		commentReplies.classList.add('comment__replies-by-comment')

		commentElement.append(commentWrapperInfo)
		commentElement.append(commentReplies)

		if (!parentComment) {
			this.commentsListOfComments.prepend(commentElement)
		} else {
			let replyParentBlock = parentComment.querySelector(
				'.comment__replies-by-comment'
			)

			if (!replyParentBlock) {
				replyParentBlock = document.createElement('div')
				replyParentBlock.classList.add('comment__replies-by-comment')
				parentComment.append(replyParentBlock)
			}

			replyParentBlock.append(commentElement)

			const parentCommentId = Number(
				parentComment.getAttribute('by-comment-id')
			)
			const parentCommentIndex = this.arrayComments.findIndex(
				comment => comment.commentId === parentCommentId
			)
			if (parentCommentIndex > -1) {
				this.arrayComments[parentCommentIndex].repliesArr?.push({
					text: value,
					isReply: isReply,
					isFavorite: isFavorite,
					parentCommentId: parentCommentId,
					repliedToUserName: repliedToUserName,
					user: userInfo,
					rating: rating,
					commentId: commentId,
					date: currentDate,
					repliesArr: [],
				})
			}
		}
		console.log(this.arrayComments)

		favoriteButton.addEventListener('click', () => {
			const commentId = commentElement.getAttribute('by-comment-id')
			const commentIndex = this.arrayComments.findIndex(
				comment => comment.commentId.toString() === commentId
			)

			const isFavorite = this.arrayComments[commentIndex].isFavorite
			this.arrayComments[commentIndex].isFavorite = !isFavorite
			console.log(this.arrayComments)
			console.log(commentId, commentIndex, isFavorite, commentElement)
			if (!isFavorite) {
				favoriteButton.textContent = 'В избранном'
				favoriteButton.style.color = '#aa2222'

				this.addCommentToFavorite(commentElement)
			} else {
				favoriteButton.textContent = 'В избранное'
				favoriteButton.style.color = 'white'
				if (commentId) this.removeCommentFromFavorite(commentId)
			}

			this.saveCommentsToStorage()
		})

		if (!isLocalStorage) {
			this.arrayComments.push({
				text: value,
				isReply: isReply,
				isFavorite: isFavorite,
				parentCommentId: parentComment
					? Number(parentComment.getAttribute('by-comment-id'))
					: null,
				repliedToUserName: repliedToUserName,
				user: userInfo,
				rating: rating,
				commentId: commentId,
				date: currentDate,
				repliesArr: [],
			})
			this.saveCommentsToStorage()
		}
		console.log(this.arrayComments)

		this.updateAmountOfComment()
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
							userInfo,
							true,
							false,
							commentElement,
							repliedToUserName,
							false,
							0
						)
						replyForm.remove()
					}
				})
			}
		})
	}
	private addCommentToFavorite(commentElement: HTMLElement): void {
		const favoriteCommentElement = commentElement?.cloneNode(true)
		const favoriteContainer = this.commentsFavoriteContainer

		if (favoriteContainer) {
			const noFavoritesMessage = favoriteContainer.querySelector('h3')
			if (noFavoritesMessage) noFavoritesMessage.remove()

			favoriteContainer.append(favoriteCommentElement)
		}
	}

	private removeCommentFromFavorite(commentId: string): void {
		const favoriteCommentElement =
			this.commentsFavoriteContainer?.querySelector(
				`[by-comment-id="${commentId}"]`
			)
		favoriteCommentElement?.remove()
		if (this.commentsFavoriteContainer?.children.length === 0) {
			this.commentsFavoriteContainer.innerHTML = `
				<h3 style='margin-top: 30px'>У вас пока нет избранных комментариев</h3>
			`
		}
	}
	private sortComments(criteria: string): void {
		let sortedComments = [...this.arrayComments]

		switch (criteria) {
			case 'main':
				window.location.reload()
				break

			case 'rating':
				sortedComments.sort((a, b) => (a.rating || 0) - (b.rating || 0))
				break

			case 'old':
				sortedComments.sort(
					(a, b) => new Date(a.date!).getTime() - new Date(b.date!).getTime()
				)
				break

			case 'new':
				sortedComments.sort(
					(a, b) => new Date(b.date!).getTime() - new Date(a.date!).getTime()
				)
				break

			case 'amountReplies':
				sortedComments.sort(
					(a, b) =>
						this.getReplyCount(b.commentId.toString()) -
						this.getReplyCount(a.commentId.toString())
				)
				break
		}

		this.updateCommentsDisplay(sortedComments)
	}

	private getReplyCount(commentText: string): number {
		return this.arrayComments.filter(
			comment =>
				comment.parentCommentId !== null && comment.text.includes(commentText)
		).length
	}

	private updateCommentsDisplay(comments: Array<any>): void {
		this.commentsListOfComments.innerHTML = ''

		comments.forEach(comment => {
			if (!comment.isReply) {
				const parentCommentElement = this.createComment(
					comment.text,
					comment.user,
					false,
					comment.isFavorite,
					null,
					null,
					true,
					comment.rating,
					comment.commentId,
					comment.date
				)

				this.commentsListOfComments.append(parentCommentElement)

				const replies = this.arrayComments.filter(
					reply => reply.parentCommentId === comment.commentId
				)

				if (replies.length > 0) {
					this.renderReplies(replies, parentCommentElement)
				}
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
			this.commentCountSpan.textContent = `${this.arrayComments.length}`
		}
	}

	private saveCommentsToStorage(): void {
		const commentsToSave = this.arrayComments.map(comment => ({
			text: comment.text,
			isReply: comment.isReply,
			isFavorite: comment.isFavorite,
			parentCommentId: comment.isReply ? comment.parentCommentId : null,
			repliedToUserName: comment.isReply ? comment.repliedToUserName : null,
			user: {
				userName: comment.user.userName,
				userImg: comment.user.userImg,
			},
			rating: comment.rating,
			commentId: comment.commentId,
			date: comment.date
				? comment.date.toISOString()
				: new Date().toISOString(),
		}))

		localStorage.setItem('comments', JSON.stringify(commentsToSave))
	}
	private renderReplies(
		replies: Array<any>,
		parentCommentElement: HTMLDivElement
	) {
		replies.forEach(reply => {
			this.createComment(
				reply.text,
				reply.user,
				true,
				reply.isFavorite,
				parentCommentElement,
				reply.repliedToUserName,
				true,
				reply.rating || 0,
				reply.commentId,
				reply.date
			)
		})
	}

	private loadCommentsFromStorage(): void {
		const savedComments = localStorage.getItem('comments')
		this.arrayComments = []

		if (savedComments) {
			const parsedComments: Array<Comment> = JSON.parse(savedComments)

			this.arrayComments = parsedComments.map(comment => ({
				text: comment.text,
				isReply: comment.isReply,
				isFavorite: comment.isFavorite,
				parentCommentId:
					comment.parentCommentId !== undefined
						? comment.parentCommentId
						: null,
				repliedToUserName:
					comment.repliedToUserName !== undefined
						? comment.repliedToUserName
						: null,
				user: comment.user,
				rating: comment.rating || 0,
				commentId: comment.commentId,
				date: comment.date ? new Date(comment.date) : new Date(),
				repliesArr: comment.repliesArr || [], // Это должно быть массивом Comment
			}))

			this.arrayComments.forEach(comment => {
				let parentCommentElement: HTMLDivElement | null = null

				if (comment.isReply && typeof comment.parentCommentId === 'number') {
					parentCommentElement = this.commentsListOfComments.querySelector(
						`[by-comment-id="${comment.parentCommentId}"]`
					)
				}

				const commentElement = this.createComment(
					comment.text,
					comment.user,
					comment.isReply,
					comment.isFavorite,
					parentCommentElement,
					comment.repliedToUserName || null,
					true,
					comment.rating || 0,
					comment.commentId,
					comment.date
				)

				if (comment.isFavorite) {
					const commentElementClone: HTMLElement | null =
						this.commentsListOfComments.querySelector(
							`[by-comment-id="${comment.commentId}"]`
						)
					if (commentElementClone) {
						this.addCommentToFavorite(commentElementClone)
					}
				}

				if (comment.repliesArr && comment.repliesArr.length > 0) {
					this.renderReplies(comment.repliesArr, commentElement)
				}
			})
		}
	}

	public getElement(): HTMLDivElement {
		return this.commentsContainer
	}
}
