import { Id } from '../types';
import { ICardData } from '../types/card';
import { ensureElement } from '../utils/utils';
import { Api } from './base/api';
import { IEvents } from './base/events';
import { IModalData, Modal } from './common/modal';

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

export class BasketItemView {
	private element: HTMLElement;

	constructor(private card: BasketCardData, private events: IEvents) {
		const template = ensureElement<HTMLTemplateElement>('#card-basket');
		this.element = template.content.firstElementChild?.cloneNode(
			true
		) as HTMLElement;

		this.init();
	}

	private init() {
		const title = ensureElement<HTMLElement>('.card__title', this.element);
		const price = ensureElement<HTMLElement>('.card__price', this.element);
		const deleteButton = ensureElement<HTMLButtonElement>(
			'.basket__item-delete',
			this.element
		);

		title.textContent = this.card.title;
		price.textContent = `${this.card.price} синапсов`;

		deleteButton.addEventListener('click', () => {
			this.events.emit('cart:cardRemoved', this.card);
		});
	}

	get totalPrice(): number {
		return Number(this.card.price);
	}

	get content(): HTMLElement {
		return this.element;
	}
}

export class CartView extends Modal {
	contentElement: HTMLElement;
	basketList: HTMLElement;
	basketButton: HTMLButtonElement;

	constructor(
		protected container: HTMLElement,
		private _model: CartModel,
		protected events: IEvents,
		private BasketItemClass: typeof BasketItemView
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
		const basketPriceElement = ensureElement<HTMLElement>(
			'.basket__price',
			this.contentElement
		);

		let total = 0;
		cards.forEach((card) => {
			const itemView = new this.BasketItemClass(card, this.events);
			this.basketList.append(itemView.content);
			total += itemView.totalPrice;
		});

		basketPriceElement.textContent = `${total} синапсов`;
	}
}
