import { ICardData } from '../types/card';
import { ensureElement } from '../utils/utils';
import { Api } from './base/api';
import { IEvents } from './base/events';
import { IModalData, Modal } from './common/modal';

//TODO: Перенести и сделать общим
export type Id = string;

export class CartModel {
	protected _cards: ICardData[];
	protected api: Api;
	protected _cartEmptyStatus: boolean;

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

	checkCartIsEmpty() {
		if (this._cards.length === 0) {
			this._cartEmptyStatus = true;
		} else {
			this._cartEmptyStatus = false;
		}
	}
	get cartEmptyStatus() {
		return this._cartEmptyStatus;
	}
	set cards(value: ICardData[]) {
		this._cards = value;
	}

	get cards(): ICardData[] | [] {
		return this._cards;
	}

	reset() {
		this.cards = [];
	}
}

export type BasketCardData = Pick<ICardData, 'id' | 'title' | 'price'>;

export class CartView extends Modal {
	contentElement: HTMLElement;
	basketList: HTMLElement;
	basketButton: HTMLButtonElement;

	constructor(
		protected container: HTMLElement,
		private _model: CartModel,
		protected events: IEvents
	) {
		super(container, events);

		this.contentElement = ensureElement<HTMLTemplateElement>(
			'#basket'
		).content.firstElementChild?.cloneNode(true) as HTMLElement;
		this.basketList = ensureElement<HTMLTemplateElement>(
			'.basket__list',
			this.contentElement
		) as HTMLElement;
		this.basketButton = ensureElement<HTMLButtonElement>(
			'.basket__button',
			this.contentElement
		);
	}

	disableCartButton(value: boolean) {
		if (value) {
			this.basketButton.disabled = true;
		} else {
			this.basketButton.disabled = false;
		}
	}

	render(data: IModalData = {}): HTMLElement {
		this.basketButton.addEventListener('click', () => {
			this.events.emit('cart:handleNextStep');
		});

		this.renderCards(this._model.cards);

		data.content = this.contentElement;

		return super.render(data);
	}

	close(): void {
		this.basketList.innerHTML = '';
	}

	updateCards(): void {
		if (this.basketList) {
			this.basketList.innerHTML = '';
			this.renderCards(this._model.cards);
		}
	}

	private renderCards(cards: BasketCardData[]): void {
		const basketPriceElement = ensureElement<HTMLTemplateElement>(
			'.basket__price',
			this.contentElement
		) as HTMLElement;

		let total = 0;

		cards.forEach((newCard) => {
			const basketItem = ensureElement<HTMLTemplateElement>(
				'#card-basket'
			).content.firstElementChild?.cloneNode(true) as HTMLElement;

			const cardTitle = ensureElement<HTMLElement>('.card__title', basketItem);
			const cardPrice = ensureElement<HTMLElement>('.card__price', basketItem);
			const basketItemDelete = ensureElement<HTMLButtonElement>(
				'.basket__item-delete',
				basketItem
			);

			cardTitle.textContent = newCard.title;
			cardPrice.textContent = `${newCard.price} синапсов`;

			total += Number(newCard.price);

			basketItemDelete.addEventListener('click', () => {
				this.events.emit('cart:cardRemoved', newCard);
			});

			this.basketList.append(basketItem);
		});

		basketPriceElement.textContent = `${total} синапсов`;
	}
}
