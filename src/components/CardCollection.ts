import { ICardModel } from '../types/card';
import { IEvents } from './base/events';
import { CardView } from './card';

export class CardCollectionModel {
	constructor(public cards: ICardModel[]) {
		this.cards = cards;
	}

	getCards() {
		return this.cards;
	}

	setCards(newCards: ICardModel[]): void {
		this.cards = newCards;
	}
}

export class CardCollectionView {
	constructor(
		private container: HTMLElement,
		private CardCollectionModel: CardCollectionModel,
		private CDN_URL: string,
		private view: new (
			container: HTMLElement,
			card: ICardModel,
			CDN_URL: string,
			events: IEvents
		) => CardView,
		private events: IEvents
	) {
		this.container = container;
		this.CardCollectionModel = CardCollectionModel;
		this.view = view;
		this.CDN_URL = CDN_URL;
	}

	render() {
		(
			this.CardCollectionModel.getCards() as unknown as Array<ICardModel>
		).forEach((card: ICardModel) => {
			new this.view(this.container, card, this.CDN_URL, this.events).render();
		});
	}
}
