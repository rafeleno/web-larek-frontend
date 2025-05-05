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

	// async fetchCards(ids: Id[]): Promise<BasketCardData[]> {
	// 	const requests = ids.map((id) => this.api.get(`/product/${id}`));
	// 	const data = await Promise.all(requests);
	// 	return data as BasketCardData[];
	// }

	addCards(newCards: ICardData): void {
		this._cards.push(newCards);
	}

	removeCards(id: Id): void {
		this._cards = this._cards.filter((item) => {
			return item.id !== id;
		});
	}

	set cards(value: ICardData[]) {
		this._cards = value;
	}

	get cards(): ICardData[] | [] {
		return this._cards;
	}

	reset() {
		this._cards = [];

		console.log('cart._cards');
		console.log(this._cards);
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
		if (!data) {
			data = {};
		}

		void this.renderAsync(data);
		return this.container;
	}

	updateCards() {
		void this.renderCards(this.container);
	}

	private async renderCards(
		rootElement: HTMLElement,
		cards?: BasketCardData[],
		basketList?: HTMLElement
	) {
		console.log(rootElement);

		if (!cards) {
			cards = this._model.cards;
		}

		if (!basketList) {
			basketList = ensureElement<HTMLElement>('.basket__list', rootElement);
		}

		const basketPriceElement = ensureElement<HTMLElement>(
			'.basket__price',
			rootElement
		);

		basketList.innerHTML = '';

		cards.forEach((card: BasketCardData) => {
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

			basketItemDelete.addEventListener('click', () =>
				this.events.emit('cart:cardRemoved', card)
			);

			basketList.append(basketItem);
		});

		basketPriceElement.textContent =
			cards.reduce((sum, card) => sum + Number(card.price), 0) + ' Синапсов';
	}

	// Костыль
	private async renderAsync(data: IModalData): Promise<HTMLElement> {
		const cards = this._model.cards;

		const content = ensureElement<HTMLTemplateElement>(
			'#basket'
		).content.firstElementChild?.cloneNode(true) as HTMLElement;

		// Корзин
		if (!content)
			throw new Error('Шаблон пустой или не содержит корневой элемент');

		const basketList = ensureElement<HTMLElement>('.basket__list', content);
		// TODO: basketButton onclick
		const basketButton = ensureElement<HTMLElement>('.basket__button', content);
		basketButton.addEventListener('click', () => {
			this.events.emit('cart:handleNextStep');
		});

		// Карты
		this.renderCards(content, cards, basketList);

		data.content = content;

		return super.render(data);
	}
}
