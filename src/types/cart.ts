import { IModalData } from '../components/common/modal';
import { ICardModel } from './card';

// Корзина
export interface ICartModel {
	totalPrice: number;
	cardsInCart: ICardModel[];
	getTotalPrice(): number;
	setTotalPrice(): void;
	getCards(): ICardModel[];
	setCards(): ICardModel[];
	reset(): void;
}

export interface ICartView extends IModalData {
	onSubmit(handler: () => void): void;
	render(data: { cards: ICardModel[]; totalPrice: number }): void;
}

export interface ICartPresenter {
	renderOrderStepOne(): void;
	init(): void;
}
