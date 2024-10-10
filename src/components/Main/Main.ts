export class Main {
	public mainElement: HTMLElement
	constructor() {
		this.mainElement = document.createElement('main')
	}
	public getElement(): HTMLElement {
		return this.mainElement
	}

	public render(element?: HTMLElement): void {
		if (element && this.mainElement) {
			this.mainElement.append(element)
		}
	}
}
