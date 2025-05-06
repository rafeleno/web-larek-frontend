import { ICardData } from '../types/card';
import { ensureElement } from '../utils/utils';
import { Api } from './base/api';
import { IEvents } from './base/events';
import { Card } from './card';
import { IModalData, Modal } from './common/modal';

//TODO: Перенести и сделать общим
export type Id = string;

export class CartModel {
	protected _cards: ICardData[];
	api: Api;

	constructor(api: Api) {
		this.api = api;
		this._cards = [];
	}

	addCards(newCard: ICardData): void {
		if (!this._cards.some((card) => card.id === newCard.id)) {
			this._cards.push(newCard);
		}
	}

	removeCards(id: Id): void {
		this._cards = this._cards.filter((item) => {
			return item.id !== id;
		});
	}

	set cards(value: ICardData[]) {
		this._cards = value;
	}

	get cards(): ICardData[] {
		return this._cards;
	}

	reset() {
		this._cards = [];
	}
}

export type BasketCardData = Pick<ICardData, 'id' | 'title' | 'price'>;

export class CartView extends Modal {
	constructor(
		protected container: HTMLElement,
		private _model: CartModel,
		protected events: IEvents
	) {
		super(container, events);
	}

	render(data?: IModalData): HTMLElement {
		const content = ensureElement<HTMLTemplateElement>(
			'#basket'
		).content.firstElementChild?.cloneNode(true) as HTMLElement;

		if (!content) throw new Error('Шаблон корзины не найден или пуст');

		const basketList = ensureElement<HTMLElement>('.basket__list', content);
		const basketButton = ensureElement<HTMLButtonElement>(
			'.basket__button',
			content
		);

		basketButton.addEventListener('click', () => {
			this.events.emit('cart:handleNextStep');
		});

		this.renderCards(this._model.cards, basketList);

		if (!data) data = {};
		data.content = content;

		return super.render(data);
	}

	updateCards(): void {
		const basketList = this.container.querySelector(
			'.basket__list'
		) as HTMLElement;
		if (basketList) {
			basketList.innerHTML = '';
			this.renderCards(this._model.cards, basketList);
		}
	}

	private renderCards(cards: BasketCardData[], basketList: HTMLElement): void {
		const basketPriceElement = this.container.querySelector(
			'.basket__price'
		) as HTMLElement;

		let total = 0;

		cards.forEach((card) => {
			const basketItem = ensureElement<HTMLTemplateElement>(
				'#card-basket'
			).content.firstElementChild?.cloneNode(true) as HTMLElement;

			const cardTitle = ensureElement<HTMLElement>('.card__title', basketItem);
			const cardPrice = ensureElement<HTMLElement>('.card__price', basketItem);
			const basketItemDelete = ensureElement<HTMLButtonElement>(
				'.basket__item-delete',
				basketItem
			);

			cardTitle.textContent = card.title;
			cardPrice.textContent = `${card.price} синапсов`;
			total += Number(card.price);

			basketItemDelete.addEventListener('click', () => {
				this.events.emit('cart:cardRemoved', card);
			});

			basketList.append(basketItem);
		});

		if (basketPriceElement) {
			basketPriceElement.textContent = `${total} синапсов`;
		}
	}
}
