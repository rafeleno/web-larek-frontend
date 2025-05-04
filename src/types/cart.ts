import { IModalData } from '../components/common/modal';
import { ICardData } from './card';

// Корзина
export interface ICartModel {
	totalPrice: number;
	cardsInCart: ICardData[];
	getTotalPrice(): number;
	setTotalPrice(): void;
	getCards(): ICardData[];
	setCards(): ICardData[];
	reset(): void;
}

export interface ICartView extends IModalData {
	onSubmit(handler: () => void): void;
	render(data: { cards: ICardData[]; totalPrice: number }): void;
}

export interface ICartPresenter {
	renderOrderStepOne(): void;
	init(): void;
}
