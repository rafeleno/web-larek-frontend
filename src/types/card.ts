// КАРТА
export type TCategory =
	| 'софт-скил'
	| 'хард-скил'
	| 'кнопка'
	| 'другое'
	| 'дополнительное';

export interface ICardData {
	id: string;
	image: string;
	price: number;
	title: string;
	description: string;
	category: TCategory;
	isInCartState: boolean;
}

// export interface ICardMainView {
// 	render(): void;
// 	onClick(handler: (id: string) => void): void;
// }

// export interface ICardModalView extends IModalData {
// 	render(): void;
// 	onClick(handler: (id: string) => void): void;
// }

// export interface ICardSmallView {
// 	render(): void;
// 	onRemove(handler: (id: string) => void): void;
// }

// export interface ICardPresenter {
// 	init(): void;
// }
