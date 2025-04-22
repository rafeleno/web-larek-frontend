import { ICart } from '../components/base/cart';
import { ICardCollection } from '../components/cardCollection';

// ШАПКА
export interface IHeader {
	cart: ICart;
	img: string;
	link: string;
}

export interface IHeaderView {
	render(data: { cart: ICart; imageUrl: string; linkUrl: string }): void;
	hide(): void;
	onCartClick(): void;
}

// ГЛАВНАЯ СТРАНИЦА
export interface IMainPage {
	cardsCollection: ICardCollection;
}

export interface IMainPageView {
	render(data: { cart: ICart; imageUrl: string; linkUrl: string }): void;
	hide(): void;
	onCardClick(): void;
}

// Рефакторинг
