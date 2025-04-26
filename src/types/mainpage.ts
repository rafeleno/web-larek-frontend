import { ICardCollectionModel } from './cardCollection';

export interface IMainPageModel {
	cardCollection: ICardCollectionModel;
	getCollection(): void;
	setCollection(): void;
}

export interface IMainPageView {
	render(data: ICardCollectionModel): void;
}

export interface IMainPagePresenter {
	init(): void;
}
