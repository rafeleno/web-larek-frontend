import { ensureElement } from '../utils/utils';
import { IEvents } from './base/events';
import { CartModel } from './cart';

// TODO: Доделать

export class HeaderModel {
	protected _productsCount: string;

	constructor(protected cartModel: CartModel) {
		this.cartModel = cartModel;
		this._productsCount = '0';
	}

	get productsCount() {
		return this._productsCount;
	}

	updateCounter(): string {
		this._productsCount = this.cartModel.cards.length.toString();
		return this._productsCount;
	}
}

// Не стал рендерить лого шапки через класс, так как
// оно меняется буквально никогда и всегда ведет в
// одно и тоже место(функционал по умолчанию)
export class HeaderView {
	logo: string;
	counter: HTMLElement;
	content: HTMLElement;
	cart: HTMLElement;

	constructor(
		protected container: HTMLElement,
		protected model: HeaderModel,
		protected events: IEvents
	) {
		this.content = ensureElement<HTMLTemplateElement>(
			'#header-template'
		).content.firstElementChild?.cloneNode(true) as HTMLElement;
		this.counter = ensureElement<HTMLTemplateElement>(
			'.header__basket-counter',
			this.content
		);
		this.cart = ensureElement<HTMLElement>('.header__basket', this.content);
	}

	render(): HTMLElement {
		this.cart.addEventListener('click', () => this.events.emit('cart:click'));

		this.container.append(this.content);
		return this.container;
	}

	updateCounter(): void {
		// Костыль
		this.counter.textContent = this.model.updateCounter();
	}
}
