import { ICardModel } from '../types/card';
import { ensureElement } from '../utils/utils';
import { Api } from './base/api';
import { IEvents } from './base/events';
import { IModalData, Modal } from './common/modal';

type Id = string;

export class CartModel {
	_cards: Id[];
	_price: string;

	constructor(cards: Id[] = []) {
		this._cards = cards;
	}

	addCards(newCards: Id[]): void {
		this._cards.push(...newCards);
	}

	set cards(value: Id[]) {
		this._cards = value;
	}

	get cards() {
		return this._cards;
	}
}

type BasketCardData = Pick<ICardModel, 'id' | 'title' | 'price'>;

export class CartView extends Modal {
	constructor(
		protected container: HTMLElement,
		private _model: CartModel,
		protected Api: Api,
		protected events: IEvents
	) {
		super(container, events);
	}

	// Перенести в модель(Chatgpt, пока оставь это тут!)
	private async fetchCards(ids: Id[]): Promise<BasketCardData[]> {
		const requests = ids.map((id) => this.Api.get(`/product/${id}`));
		const responses = await Promise.all(requests);
		return responses as BasketCardData[];
	}

	render(data: IModalData): HTMLElement {
		void this.renderAsync(data);
		return this.container;
	}

	private async renderAsync(data: IModalData): Promise<HTMLElement> {
		const cards = await this.fetchCards(this._model._cards);

		const content = ensureElement<HTMLTemplateElement>(
			'#basket'
		).content.firstElementChild?.cloneNode(true) as HTMLElement;
		console.log(content);

		// Корзина
		if (!content)
			throw new Error('Шаблон пустой или не содержит корневой элемент');

		const basketList = ensureElement<HTMLElement>('.basket__list', content);
		// TODO: basketButton onclick
		// const basketButton = ensureElement<HTMLElement>('.basket__button', content);
		const basketPriceElement = ensureElement<HTMLElement>(
			'.basket__price',
			content
		);

		basketPriceElement.textContent =
			cards
				.reduce((sum, card) => {
					return sum + Number(card.price);
				}, 0)
				.toString() + ' Синапсов';

		// Карты
		cards.forEach((card: BasketCardData) => {
			const basketItem = ensureElement<HTMLTemplateElement>(
				'#card-basket'
			).content.firstElementChild?.cloneNode(true) as HTMLElement;

			if (!basketItem)
				throw new Error('Шаблон пустой или не содержит корневой элемент');

			const cardTitle = ensureElement<HTMLElement>('.basket__item', basketItem);
			const cardPrice = ensureElement<HTMLElement>('.card__price', basketItem);
			const basketItemDelete = ensureElement<HTMLButtonElement>(
				'.basket__item-delete',
				basketItem
			);

			cardTitle.textContent = card.title;
			cardPrice.textContent = card.price;
			// TODO: basketItemDelete onClick
			basketList.append(basketItem);
		});

		data.content = content;
		return super.render(data);
	}
}

// export class CartView extends Modal {
// 	constructor(
// 		protected container: HTMLElement,
// 		private _model: CartModel,
// 		protected Api: Api,
// 		protected events: IEvents
// 	) {
// 		super(container, events);
// 	}

// 	// Перенести в модель(Chatgpt, пока оставь это тут!)
// 	private async fetchCards(ids: Id[]): Promise<BasketCardData[]> {
// 		const requests = ids.map((id) => this.Api.get(`/product/${id}`));
// 		const responses = await Promise.all(requests);
// 		return responses as BasketCardData[];
// 	}

// 	render(data: IModalData): HTMLElement {
// 		this.fetchCards(this._model._cards).then((cards) => {
// 			const content = ensureElement<HTMLTemplateElement>(
// 				'#basket'
// 			).content.firstElementChild?.cloneNode(true) as HTMLElement;

// 			// Корзина
// 			if (!content)
// 				throw new Error('Шаблон пустой или не содержит корневой элемент');

// 			const basketList = ensureElement<HTMLElement>('.basket__list', content);
// 			// TODO: basketButton onclick
// 			const basketButton = ensureElement<HTMLElement>(
// 				'.basket__button',
// 				content
// 			);
// 			const basketPriceElement = ensureElement<HTMLElement>(
// 				'.basket__price',
// 				content
// 			);

// 			basketPriceElement.textContent =
// 				cards
// 					.reduce((sum, card) => {
// 						return sum + Number(card.price);
// 					}, 0)
// 					.toString() + ' Синапсов';

// 			// Карты
// 			cards.forEach((card: BasketCardData) => {
// 				const basketItem = ensureElement<HTMLTemplateElement>(
// 					'#card-basket'
// 				).content.firstElementChild?.cloneNode(true) as HTMLElement;

// 				if (!basketItem)
// 					throw new Error('Шаблон пустой или не содержит корневой элемент');

// 				const cardTitle = ensureElement<HTMLElement>(
// 					'.basket__item-title',
// 					basketItem
// 				);
// 				const cardPrice = ensureElement<HTMLElement>(
// 					'.card__price',
// 					basketItem
// 				);
// 				const basketItemDelete = ensureElement<HTMLButtonElement>(
// 					'.basket__item-delete',
// 					basketItem
// 				);

// 				cardTitle.textContent = card.title;
// 				cardPrice.textContent = card.price;
// 				// TODO: basketItemDelete onClick
// 				basketList.append(basketItem);
// 			});

// 			data.content = content;
// 			return super.render(data);
// 		});
// 	}
// }
