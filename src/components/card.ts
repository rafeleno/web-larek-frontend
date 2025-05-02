import { ICardModel, TCategory } from '../types/card';
import { ensureElement } from '../utils/utils';
import { IEvents } from './base/events';
import { IModalData, Modal } from './common/modal';

export class Card implements ICardModel {
	id: string;
	image: string;
	price: string;
	title: string;
	description: string;
	category: TCategory;

	constructor(
		id: string,
		image: string,
		price: string,
		cardName: string,
		description: string,
		category: TCategory
	) {
		this.id = id;
		this.image = image;
		this.price = price;
		this.title = cardName;
		this.description = description;
		this.category = category;
	}

	getCard(): ICardModel {
		return this;
	}
}

export class CardView {
	container: HTMLElement;
	card: ICardModel;
	events: IEvents;
	CDN: string;

	constructor(
		container: HTMLElement,
		card: ICardModel,
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
	constructor(
		protected container: HTMLElement,
		private _model: ICardModel,
		public events: IEvents,
		protected CDN: string
	) {
		super(container, events);
	}

	get model() {
		return this._model;
	}

	set model(value: ICardModel) {
		this._model = value;
	}

	render(data: IModalData): HTMLElement {
		const content = ensureElement<HTMLTemplateElement>(
			'#card-preview'
		).content.firstElementChild?.cloneNode(true) as HTMLElement;

		if (!content)
			throw new Error('Шаблон пустой или не содержит корневой элемент');

		ensureElement<HTMLImageElement>('.card__image', content).src =
			this.CDN + this._model.image.replace('.svg', '.png');
		ensureElement<HTMLElement>('.card__category', content).textContent =
			this._model.category;
		ensureElement<HTMLElement>('.card__title', content).textContent =
			this._model.title;
		ensureElement<HTMLElement>('.card__text', content).textContent =
			this._model.description;
		ensureElement<HTMLButtonElement>('.card__button', content).addEventListener(
			'click',
			() => this.events.emit('card:buy', this._model.id.split(','))
		);
		ensureElement<HTMLElement>('.card__price', content).textContent =
			this._model.price + ' Синапсов';

		// Костыль
		data.content = content;

		return super.render(data);
	}
}
