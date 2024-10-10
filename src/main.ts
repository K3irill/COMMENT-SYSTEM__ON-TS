import { Aside } from './components/Aside/aside'
import { Header } from './components/Header/header'
import { Main } from './components/Main/Main'
import { MovieContainer } from './components/MovieContainer/movieContainer'
import './style.scss'

export class App {
	private appElement: HTMLDivElement | null
	constructor() {
		this.appElement = document.querySelector<HTMLDivElement>('#app')
		if (this.appElement) {
			this.render()
		}
	}
	public render(element?: HTMLElement): void {
		if (element && this.appElement) {
			this.appElement.append(element)
		}
	}
}
const app = new App()

const header = new Header()
const aside = new Aside()
const main = new Main()

const contentContainer = document.createElement('div')
contentContainer.classList.add('content-container')

contentContainer.append(aside.getElement())
contentContainer.append(main.getElement())

app.render(header.getElement())
app.render(contentContainer)

const movieContainer = new MovieContainer()
main.render(movieContainer.getElement())
