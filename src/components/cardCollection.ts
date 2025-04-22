import { ICard } from './cart';

// КОЛЛЕКЦИЯ КАРТ
export interface ICardCollection {
	cards: ICard[];
}

export interface ICardCollectionModel {
	setCards(cards: ICard[]): void;
	getCards(): ICard[];
}

export interface ICardCollectionView {
	render(cards: ICard[]): void;
}
