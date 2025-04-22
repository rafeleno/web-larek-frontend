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

// КАРТА
export type TTag = 'soft' | 'hard' | 'button' | 'another' | 'advanced';

export interface ICard {
	cardName: string;
	cardDescription: string;
	cardImage: string;
	cardTag: TTag;
}

export interface ICardModel {
	addToCart(product: ICard): void;
	removeFromCart(id: number): void;
	getCard(): ICard;
	render(): HTMLElement;
}

export interface ICardMainView {
	render(): void;
	onClick(): void;
}

export interface ICardModalView {
	render(): void;
	onClose(): void;
	onClick(handler: (id: string) => void): void;
}

export interface ICardSmallView {
	render(): void;
	onRemove(handler: (id: string) => void): void;
}

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

// ЗАКАЗ
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

export interface IOrderStepOneModel {
	updateField<T extends keyof TPayMethod>(key: T, value: TPayMethod[T]): void;
	updateField<T extends keyof string>(key: T, value: string): void;
}

export interface IOrderStepTwoModel {
	updateField<T extends keyof string>(key: T, value: string): void;
	updateField<T extends keyof string>(key: T, value: string): void;
}

export interface IOrderStepThreeModel {
	totalPrice: number;
	setTotalPrice(): void;
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
	setPrice(): void;
	render(): void;
	hide(): void;
}

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
	render(cards: ICard[], totalPrice: number): void;
	hide(): void;
}

export interface IController {
	init(): void;
}

// Рефакторинг, раскидать по папкам
