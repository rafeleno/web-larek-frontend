import { IEvents } from '../components/base/events';
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
	title: string;
	description: string;
	category: TCategory;
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
