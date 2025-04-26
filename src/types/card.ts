import { IModalData } from '../components/common/modal';

// КАРТА
export type TCategory =
	| 'софт-скил'
	| 'хард-скил'
	| 'кнопка'
	| 'другое'
	| 'дополнительное';

export interface ICardModel {
	id: string;
	image: string;
	price: string;
	cardName: string;
	description: string;
	category: TCategory;

	addToCart(id: string): void;
	removeFromCart(id: number): void;
	getCard(): ICardModel;
}

export interface ICardMainView {
	render(): void;
	onClick(handler: (id: string) => void): void;
}

export interface ICardModalView extends IModalData {
	render(): void;
	onClick(handler: (id: string) => void): void;
}

export interface ICardSmallView {
	render(): void;
	onRemove(handler: (id: string) => void): void;
}

export interface ICardPresenter {
	init(): void;
}
