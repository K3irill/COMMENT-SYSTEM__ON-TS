const users: string[] = loadUsersFromStorage() || []
console.log(users)

export function makeUserInfo() {
	const savedUserInfo = loadUserInfoFromStorage()

	if (savedUserInfo) {
		return savedUserInfo
	}

	const userName = getUserName()
	const userImg = getUserImg()

	if (userName && userImg) {
		const userInfo = { userName, userImg }

		saveUserInfoToStorage(userInfo)
		return userInfo
	} else {
		throw new Error('Не удалось создать пользователя')
	}
}

function getUserName(): string {
	const isNeedUserName = confirm('Вы хотите ввести никнейм или по дефолту?')

	let userName: string

	if (isNeedUserName) {
		userName = askUniqueUserName()
	} else {
		userName = createDefaultUserName()
	}

	alert(`Спасибо. Ваше имя ${userName}`)
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
		'Вы хотите задать свою аватарку или по дефолту?'
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

//-----------------------------------------------------
function saveUserInfoToStorage(userInfo: {
	userName: string
	userImg: string
}) {
	localStorage.setItem('userInfo', JSON.stringify(userInfo))
}

function loadUserInfoFromStorage(): {
	userName: string
	userImg: string
} | null {
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
