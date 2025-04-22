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
