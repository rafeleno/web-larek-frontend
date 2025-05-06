import { ICardData, TCategory } from '../types/card';
import { ensureElement } from '../utils/utils';
import { IEvents } from './base/events';
import { Id } from './cart';
import { IModalData, Modal } from './common/modal';

export class Card {
	protected _isInCartState = false;

	constructor(
		protected _id: string,
		protected _image: string,
		protected _price: number,
		protected _title: string,
		protected _description: string,
		protected _category: TCategory
	) {}

	get isInCartState() {
		return this._isInCartState;
	}
	set isInCartState(value: boolean) {
		this._isInCartState = value;
	}
	get id() {
		return this._id;
	}
	set id(value: Id) {
		this._id = value;
	}
	get image() {
		return this._image;
	}
	set image(value: string) {
		this._image = value;
	}
	get price() {
		return this._price;
	}
	set price(value: number) {
		this._price = value;
	}
	get title() {
		return this._title;
	}
	set title(value: string) {
		this._title = value;
	}
	get description() {
		return this._description;
	}
	set description(value: string) {
		this._description = value;
	}
	get category() {
		return this._category;
	}
	set category(value: TCategory) {
		this._category = value;
	}

	// Оптимизировать (убрать лишенее?)
	get cardData(): ICardData {
		return {
			id: this._id,
			image: this._image,
			price: this._price,
			title: this.title,
			description: this._description,
			category: this._category,
			isInCartState: this.isInCartState,
		};
	}

	isInCart(cardsInCart: ICardData[]): void {
		if (cardsInCart.some((card) => card.id === this.id)) {
			this.isInCartState = true;
			console.log('this.isInCartState = true');
		} else {
			this.isInCartState = false;
			console.log('this.isInCartState = false');
		}
	}
}

export class CardView {
	container: HTMLElement;
	card: Card;
	events: IEvents;
	CDN: string;

	constructor(
		container: HTMLElement,
		card: Card,
		CDN_URL: string,
		events: IEvents
	) {
		this.container = container;
		this.card = card;
		this.CDN = CDN_URL;
		this.events = events;
	}

	render() {
		const template = document.querySelector(
			'#card-catalog'
		) as HTMLTemplateElement;

		if (template) {
			const cardEl = template.content.firstElementChild.cloneNode(
				true
			) as HTMLElement;

			ensureElement<HTMLImageElement>('.card__image', cardEl).src =
				this.CDN + this.card.image.replace('.svg', '.png');
			ensureElement<HTMLElement>('.card__category', cardEl).textContent =
				this.card.category;
			ensureElement<HTMLElement>('.card__title', cardEl).textContent =
				this.card.title;
			ensureElement('.card__price', cardEl).textContent =
				this.card.price + ' синапсов';

			// Событие открытия модальтног окна
			cardEl.addEventListener('click', () =>
				this.events.emit('card:click', this.card)
			);

			ensureElement('.gallery')?.appendChild(cardEl);
		}
	}
}

export class CardModal extends Modal {
	contentElement = ensureElement<HTMLTemplateElement>(
		'#card-preview'
	).content.firstElementChild?.cloneNode(true) as HTMLElement;
	cardImageElement = ensureElement<HTMLImageElement>(
		'.card__image',
		this.contentElement
	);
	cardCategoryElement = ensureElement<HTMLImageElement>(
		'.card__category',
		this.contentElement
	);
	cardTitleElement = ensureElement<HTMLImageElement>(
		'.card__title',
		this.contentElement
	);
	cardTextElement = ensureElement<HTMLImageElement>(
		'.card__text',
		this.contentElement
	);
	cardButtonElement = ensureElement<HTMLButtonElement>(
		'.card__button',
		this.contentElement
	);
	cardPriceElement = ensureElement<HTMLElement>(
		'.card__price',
		this.contentElement
	);

	constructor(
		protected container: HTMLElement,
		private _model: Card,
		public events: IEvents,
		protected CDN: string
	) {
		super(container, events);
	}

	set model(value: Card) {
		this._model = value;
	}

	get model() {
		return this._model;
	}

	close() {
		super.close();
		this.events.emit('cardModal:close', this);
	}

	// Маленький Костыль
	blockButton(value: boolean) {
		if (value) {
			this.cardButtonElement.disabled = true;
			this.cardButtonElement.textContent = 'В корзине';
		} else {
			this.cardButtonElement.disabled = false;
			this.cardButtonElement.textContent = 'В корзину';
		}
	}

	render(data?: IModalData): HTMLElement {
		if (!data) {
			data = {};
		}

		// Костыль
		this.container.classList.remove('step-three-modal');

		this.cardImageElement.src =
			this.CDN + this._model.image.replace('.svg', '.png');
		this.cardCategoryElement.textContent = this._model.category;
		this.cardTitleElement.textContent = this._model.title;
		this.cardTextElement.textContent = this._model.description;

		if (this.model.isInCartState) {
			this.cardButtonElement.disabled = true;
			this.cardButtonElement.textContent = 'В корзине';
		}
		this.cardButtonElement.addEventListener('click', () => {
			this.events.emit('cardModal:buy', this);
		});

		this.cardPriceElement.textContent = this._model.price + ' Синапсов';

		// Костыль
		data.content = this.contentElement;

		return super.render(data);
	}
}
