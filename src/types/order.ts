import { IModalData } from '../components/common/modal';
import { ICardModel } from './card';

// ЗАКАЗ
export type TPayMethod = 'cash' | 'non-cash';

export interface IOrderModel {
	cards: ICardModel[];
	data: Partial<IOrderModel>;
	userMail: string;
	userPhone: string;
	userAddress: string;
	payMethod: TPayMethod;

	addCard(): void;
	updateField<T extends keyof IOrderModel>(key: T, value: IOrderModel[T]): void;
	isValid(): boolean;
	getData(): Partial<IOrderModel>;
	isComplete(): boolean;
	reset(): void;
}

export interface IOrderStepOneView extends IModalData {
	payMethodOnlineButton: HTMLButtonElement;
	payMethodCashButton: HTMLButtonElement;
	userAddressInput: HTMLInputElement;
	OrderStepOneSubmit: HTMLButtonElement;

	onSubmit(handler: () => void): void;
	render(): void;
}

export interface IOrderStepTwoView extends IModalData {
	userMailInput: HTMLInputElement;
	userPhoneInput: HTMLInputElement;
	OrderStepTwoSubmit: HTMLButtonElement;

	onSubmit(handler: () => void): void;
	render(): void;
}

export interface IOrderStepThreeView extends IModalData {
	price: string;
	OrderStepThreeSubmit: HTMLButtonElement;
	onSubmit(handler: () => void): void;
	render(): void;
}

export interface IOrderPresenter {
	getDataStepOne(): { address: string; payMethod: TPayMethod };
	getDataStepTwo(): { email: string; phone: string };
	valid(value: boolean): void;
	errors(value: string): void;
	init(): void;
}
