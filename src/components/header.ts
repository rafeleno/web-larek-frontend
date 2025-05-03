import { ensureElement } from '../utils/utils';
import { Component } from './base/Component';
import { IEvents } from './base/events';
import { CartModel } from './cart';

// TODO: Доделать

export class HeaderModel {
	protected _productsCount: string;

	constructor(protected CartModel: CartModel) {
		this.CartModel = CartModel;
		this._productsCount = '0';
	}

	get productsCount() {
		return this._productsCount;
	}

	updateCounter(): string {
		this._productsCount = this.CartModel._cards.length.toString();
		return this._productsCount;
	}
}

// Не стал рендерить лого шапки через класс, так как
// оно меняется буквально никогда и всегда ведет в
// одно и тоже место(функционал по умолчанию)
export class HeaderView {
	logo: string;

	constructor(
		protected container: HTMLElement,
		protected model: HeaderModel,
		protected events: IEvents
	) {}

	render(): HTMLElement {
		const content = ensureElement<HTMLTemplateElement>(
			'#header-template'
		).content.firstElementChild?.cloneNode(true) as HTMLElement;

		const cart = ensureElement<HTMLElement>('.header__basket', content);

		cart.addEventListener('click', () => this.events.emit('cart:click'));

		this.container.append(content);
		return this.container;
	}

	updateCounter(): void {
		const counter = ensureElement<HTMLTemplateElement>(
			'.header__basket-counter'
		);

		// Костыль
		counter.textContent = this.model.updateCounter();
	}
}
