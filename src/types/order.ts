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
