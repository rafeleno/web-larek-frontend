import { ICardModel } from './card';

// КОЛЛЕКЦИЯ КАРТ

export interface ICardCollectionModel {
	cards: ICardModel[];

	setCards(cards: ICardModel[]): void;
	getCards(): ICardModel[];
}

export interface ICardCollectionView {
	render(cards: ICardModel[]): void;
}

export interface ICardCollectionPresenter {
	init(): void;
}
