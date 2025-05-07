import { IEvents } from './base/events';
import { Card, CardView } from './card';

export class CardCollectionModel {
	constructor(protected _cards: Card[]) {}

	get cards(): Card[] {
		return this._cards;
	}

	set cards(newCards: Card[]) {
		this._cards = newCards;
	}
}

export class CardCollectionView {
	constructor(
		private container: HTMLElement,
		private CardCollectionModel: CardCollectionModel,
		private CDN_URL: string,
		private ViewClass: typeof CardView,
		private events: IEvents
	) {}

	render() {
		(this.CardCollectionModel.cards as unknown as Array<Card>).forEach(
			(card: Card) => {
				new this.ViewClass(
					this.container,
					card,
					this.CDN_URL,
					this.events
				).render();
			}
		);
	}
}
