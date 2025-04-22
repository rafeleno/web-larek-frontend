import { ICard } from './card';

// Корзина
export interface ICart {
	cards: ICard[];
	totalPrice: number;
}

export interface ICartModel {
	getTotalPrice(): number;
	setTotalPrice(): void;
	getCards(): ICard[];
	setCards(): ICard[];
}

export interface ICartView {
	render(data: { cards: ICard[]; totalPrice: number }): void;
	hide(): void;
}

export interface IController {
	init(): void;
}
