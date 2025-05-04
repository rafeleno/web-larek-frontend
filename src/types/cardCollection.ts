import { ICardData } from './card';

// КОЛЛЕКЦИЯ КАРТ

export interface ICardCollectionModel {
	cards: ICardData[];

	setCards(cards: ICardData[]): void;
	getCards(): ICardData[];
}

export interface ICardCollectionView {
	render(cards: ICardData[]): void;
}

export interface ICardCollectionPresenter {
	init(): void;
}
