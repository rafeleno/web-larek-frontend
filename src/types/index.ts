export type TTag = 'soft' | 'hard' | 'button' | 'another' | 'advanced';

export interface ICard {
	cardName: string;
	cardDescription: string;
	cardImage: string;
	cardTag: TTag;
}

export interface ICardCollectionModel {
	setCards(cards: ICard[]): void;
	getCards(): ICard[];
}

export interface ICartModel {
	addToCart(product: ICard): void;
	removeFromCart(id: number): void;
	getCart(): ICard[];
	render(): HTMLElement;
}

export type TPayMethod = 'cash' | 'non-cash';

export interface IOrder {
	userMail: RegExp;
	userPhone: RegExp;
	userAddress: string;
	payMethod: TPayMethod;
}

export interface IOrderModel {
	data: Partial<IOrder>;
	updateField<T extends keyof IOrder>(key: T, value: IOrder[T]): void;
	getData(): Partial<IOrder>;
	isComplete(): boolean;
	reset(): void;
}

export interface IBucketView {
	render(cards: ICard[], totalPrice: number): void;
	hide(): void;
	onRemove(handler: (id: string) => void): void;
}

export interface IOrderStepOneView {
	getData(): { address: string; payMethod: TPayMethod };
	render(): void;
	hide(): void;
}

export interface IOrderStepTwoView {
	getData(): { email: string; phone: string };
	render(): void;
	hide(): void;
}

export interface IOrderStepThreeView {
	price: number;
	render(): void;
	hide(): void;
}

export interface IShopView {
	renderCards(cards: ICard[]): void;
	renderCart(cart: ICard): void;
	handleBuy(handler: (id: number) => void): void;
	handleRemove(handler: (id: number) => void): void;
}

export interface Controller {
	init(): void;
}

// Рефакторинг, раскидать по папкам
