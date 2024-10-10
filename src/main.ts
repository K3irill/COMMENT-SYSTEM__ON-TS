import { Aside } from './components/Aside/aside'
import { Header } from './components/Header/header'
import './style.css'

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
			this.appElement.appendChild(element)
		}
	}
}
const app = new App()

const header = new Header()
const aside = new Aside()

app.render(header.getElement())
app.render(aside.getElement())
