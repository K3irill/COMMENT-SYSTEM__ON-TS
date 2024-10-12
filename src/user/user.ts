const users: string[] = loadUsersFromStorage() || []
console.log(users)

export function makeUserInfo() {
	const currentUserName = loadCurrentUserNameFromStorage()

	if (currentUserName) {
		const savedUserInfo = loadUserInfoFromStorage(currentUserName)
		if (savedUserInfo) {
			return savedUserInfo
		}
	}

	const userName = getUserName()
	const userImg = getUserImg()

	if (userName && userImg) {
		const userInfo = { userName, userImg }
		saveUserInfoToStorage(userInfo, userName)
		saveCurrentUserNameToStorage(userName)
		return userInfo
	} else {
		throw new Error('Не удалось создать пользователя')
	}
}

function getUserName(): string {
	const isNeedUserName = confirm('Задать свой никнейм? Если нет то по дефолту.')
	let userName: string

	if (isNeedUserName) {
		userName = askUniqueUserName()
	} else {
		userName = createDefaultUserName()
	}

	alert(`Хорошо. Ваше имя ${userName}`)
	return userName
}

function askUniqueUserName(): string {
	let userName: string | null

	do {
		userName = prompt('Введите никнейм')
		if (!userName) {
			alert('Имя не может быть пустым. Пожалуйста, введите никнейм.')
			continue
		}
		if (users.includes(userName)) {
			alert('Это имя уже используется. Пожалуйста, введите другое имя.')
		}
	} while (!userName || users.includes(userName))

	users.push(userName)
	saveUsersToStorage(users)
	return userName
}

function createDefaultUserName(): string {
	let id = 1
	let defaultUserName = `user${id}`

	while (users.includes(defaultUserName)) {
		id++
		defaultUserName = `user${id}`
	}

	users.push(defaultUserName)
	saveUsersToStorage(users)
	return defaultUserName
}

function getUserImg(): string {
	const isNeedUserImg = confirm(
		'Задать свою аватарку?. Если нет то по дефолту.'
	)

	if (isNeedUserImg) {
		let userImg: string | null
		do {
			userImg = prompt('Введите ссылку на аватарку')
			if (!isValidUrl(userImg)) {
				alert('Некорректная ссылка. Пожалуйста, введите правильный URL.')
			}
		} while (userImg && !isValidUrl(userImg))

		return (
			userImg || 'https://cs13.pikabu.ru/avatars/3240/x3240901-1716084729.png'
		)
	} else {
		return 'https://cs13.pikabu.ru/avatars/3240/x3240901-1716084729.png'
	}
}

function isValidUrl(url: string | null): boolean {
	try {
		new URL(url || '')
		return true
	} catch (_) {
		return false
	}
}

export function switchUser() {
	const userName = prompt('Введите имя пользователя для переключения:')
	if (userName && users.includes(userName)) {
		saveCurrentUserNameToStorage(userName)
		alert(`Переключено на пользователя: ${userName}`)

		const currentUserInfo = loadUserInfoFromStorage(userName)
		window.location.reload()
		if (currentUserInfo) {
			console.log(
				`Текущий пользователь: ${currentUserInfo.userName}`,
				currentUserInfo.userImg
			)
		}
	} else {
		alert('Пользователь не найден!')
	}
}

export function createNewUser() {
	let userName: string | null

	do {
		userName = prompt('Введите имя пользователя:')
		if (userName === null) {
			alert('Создание пользователя отменено.')
			return
		}
		if (userName.trim() === '') {
			alert('Имя пользователя не может быть пустым. Пожалуйста, введите имя.')
		} else if (users.includes(userName)) {
			alert('Извините, это имя занято. Пожалуйста, выберите другое имя.')
		}
	} while (userName && (userName.trim() === '' || users.includes(userName)))

	if (userName) {
		users.push(userName)
		saveUsersToStorage(users)

		const userImg = getUserImg()
		const userInfo = { userName, userImg }
		saveUserInfoToStorage(userInfo, userName)
		saveCurrentUserNameToStorage(userName)
		window.location.reload()
	}
}

//-----------------------------------------------------
function saveUserInfoToStorage(
	userInfo: { userName: string; userImg: string },
	userName: string
) {
	const allUserInfo = loadAllUserInfoFromStorage() || {}
	allUserInfo[userName] = userInfo
	localStorage.setItem('userInfo', JSON.stringify(allUserInfo))
}

function loadUserInfoFromStorage(
	userName: string
): { userName: string; userImg: string } | null {
	const allUserInfo = loadAllUserInfoFromStorage()
	if (allUserInfo && allUserInfo[userName]) {
		return allUserInfo[userName]
	}
	return null
}

function loadAllUserInfoFromStorage(): Record<
	string,
	{ userName: string; userImg: string }
> | null {
	const savedUserInfo = localStorage.getItem('userInfo')
	if (savedUserInfo) {
		return JSON.parse(savedUserInfo)
	}
	return null
}

function saveUsersToStorage(users: string[]) {
	localStorage.setItem('users', JSON.stringify(users))
}

function loadUsersFromStorage(): string[] | null {
	const savedUsers = localStorage.getItem('users')
	if (savedUsers) {
		return JSON.parse(savedUsers)
	}
	return null
}

function saveCurrentUserNameToStorage(userName: string) {
	localStorage.setItem('currentUser', userName)
}

function loadCurrentUserNameFromStorage(): string | null {
	return localStorage.getItem('currentUser')
}
