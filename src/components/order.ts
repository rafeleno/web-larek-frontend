import { ICardData } from '../types/card';
import { TPayMethod } from '../types/order';
import { ensureElement } from '../utils/utils';
import { Api } from './base/api';
import { IEvents } from './base/events';
import { Card } from './card';
import { Id } from './cart';
import { IModalData, Modal } from './common/modal';

export type OrderData = {
	payment: TPayMethod;
	email: string;
	phone: string;
	address: string;
	total: number;
	items: Id[];
};

export class OrderModel {
	protected _payment: TPayMethod = 'empty';
	protected _email = '';
	protected _phone = '';
	protected _address = '';
	protected _items: ICardData[] = [];
	protected emailValidState = false;
	protected phoneValidState = false;
	protected _stepOneErrorState: {
		status: 'error' | 'non-error';
		errors: 'payMethod' | 'address' | 'non';
	};
	protected _stepTwoErrorState: {
		status: 'error' | 'non-error';
		errors: 'email' | 'phone' | 'non';
	};

	constructor(protected api: Api) {
		this._stepOneErrorState = {
			status: 'non-error',
			errors: 'non',
		};
		this._stepTwoErrorState = {
			status: 'non-error',
			errors: 'non',
		};
	}

	get stepOneErrorState() {
		return this._stepOneErrorState;
	}
	get stepTwoErrorState() {
		return this._stepTwoErrorState;
	}
	get payment() {
		return this._payment;
	}
	set payment(value: TPayMethod) {
		this._payment = value;
	}
	get email() {
		return this._email;
	}
	set email(value: string) {
		this._email = value;
	}
	get phone() {
		return this._phone;
	}
	set phone(value: string) {
		this._phone = value;
	}
	get address() {
		return this._address;
	}
	set address(value: string) {
		this._address = value;
	}
	get items() {
		return this._items;
	}
	set items(value: ICardData[]) {
		this._items = value;
	}
	get total() {
		return this.items.reduce((sum, item) => sum + item.price, 0);
	}
	get postData() {
		return {
			payment: this.payment,
			email: this.email,
			phone: this.phone,
			address: this.address,
			total: this.total,
			items: this.items.map((card) => card.id),
		};
	}

	stepOneIsValid(modal: OrderStepOneModal): void {
		if (
			!modal.buttonCash.classList.contains('button_alt-active') &&
			!modal.buttonCard.classList.contains('button_alt-active')
		) {
			this._stepOneErrorState.status = 'error';
			this._stepOneErrorState.errors = 'payMethod';
		} else if (modal.addressInput.value.length < 1) {
			this._stepOneErrorState.status = 'error';
			this._stepOneErrorState.errors = 'address';
		} else {
			this._stepOneErrorState.status = 'non-error';
			this._stepOneErrorState.errors = 'non';
		}
	}

	stepTwoIsValid(): void {
		if (!this.emailValidState) {
			this._stepTwoErrorState.status = 'error';
			this._stepTwoErrorState.errors = 'email';
		} else if (!this.phoneValidState) {
			this._stepTwoErrorState.status = 'error';
			this._stepTwoErrorState.errors = 'phone';
		} else {
			this._stepTwoErrorState.status = 'non-error';
			this._stepTwoErrorState.errors = 'non';
		}
	}

	emailIsValid(value: string) {
		const emailRegExp = /^[\p{L}0-9._%+-]+@[\p{L}0-9.-]+\.[\p{L}]{2,}$/u;

		if (typeof value !== 'string') {
			return false;
		}
		if (emailRegExp.test(value)) {
			this.emailValidState = true;
		} else this.emailValidState = false;
	}

	phoneIsValid(value: string) {
		const phoneRegExp = /^(\s*)?(\+)?([- _():=+]?\d[- _():=+]?){10,14}(\s*)?$/;

		if (typeof value !== 'string') {
			return false;
		}
		if (phoneRegExp.test(value)) {
			this.phoneValidState = true;
		} else this.phoneValidState = false;
	}

	async post(): Promise<OrderData> {
		try {
			const response = (await this.api.post(
				'/order',
				this.postData
			)) as OrderData;
			return response;
		} catch (error) {
			console.error('Ошибка при отправке заказа:', error);
		}
	}
}

export class OrderStepOneModal extends Modal {
	formContent: HTMLElement;
	buttonCard: HTMLButtonElement;
	buttonCash: HTMLButtonElement;
	addressInput: HTMLInputElement;
	formButton: HTMLButtonElement;
	error: HTMLElement;

	constructor(container: HTMLElement, events: IEvents) {
		super(container, events);

		this.formContent = ensureElement<HTMLTemplateElement>(
			'#order'
		).content.firstElementChild?.cloneNode(true) as HTMLElement;
		this.buttonCard = ensureElement<HTMLButtonElement>(
			'[name="card"]',
			this.formContent
		);
		this.buttonCash = ensureElement<HTMLButtonElement>(
			'[name="cash"]',
			this.formContent
		);
		this.addressInput = ensureElement<HTMLInputElement>(
			'[name="address"]',
			this.formContent
		);
		this.formButton = ensureElement<HTMLButtonElement>(
			'.order__button',
			this.formContent
		);
		this.error = ensureElement<HTMLElement>('.form__errors', this.formContent);

		this.buttonCard.addEventListener('click', () => {
			this.buttonCard.classList.add('button_alt-active');
			this.buttonCash.classList.remove('button_alt-active');

			this.events.emit('order:card');
		});

		this.buttonCash.addEventListener('click', () => {
			this.buttonCash.classList.add('button_alt-active');
			this.buttonCard.classList.remove('button_alt-active');

			this.events.emit('order:cash');
		});

		this.addressInput.addEventListener('input', () => {
			this.events.emit('addressInput:input');
		});

		this.formButton.addEventListener('click', () => {
			this.events.emit('orderStepOne:handleNextStep');
		});
	}

	updateError(value: string) {
		this.error.textContent = value;
	}

	reset() {
		this.buttonCash.classList.remove('button_alt-active');
		this.buttonCard.classList.remove('button_alt-active');
		this.formButton.disabled = true;
		this.addressInput.value = '';
	}

	render(data: IModalData = {}): HTMLElement {
		data.content = this.formContent;
		return super.render(data);
	}
}

// Второй шаг

export class OrderStepTwoModal extends Modal {
	formContent: HTMLElement;
	emailInput: HTMLInputElement;
	phoneInput: HTMLInputElement;
	formButton: HTMLButtonElement;
	error: HTMLElement;

	constructor(container: HTMLElement, events: IEvents) {
		super(container, events);

		// TODO:
		this.formContent = ensureElement<HTMLTemplateElement>(
			'#contacts'
		).content.firstElementChild?.cloneNode(true) as HTMLElement;
		this.emailInput = ensureElement<HTMLInputElement>(
			'[name="email"]',
			this.formContent
		);
		this.phoneInput = ensureElement<HTMLInputElement>(
			'[name="phone"]',
			this.formContent
		);
		// TODO:
		this.formButton = ensureElement<HTMLButtonElement>(
			'.button',
			this.formContent
		);
		this.error = ensureElement<HTMLElement>('.form__errors', this.formContent);

		this.emailInput.addEventListener('input', () => {
			this.events.emit('emailInput:input');
		});

		this.phoneInput.addEventListener('input', () => {
			this.events.emit('phoneInput:input');
		});

		this.formButton.addEventListener('click', (e) => {
			e.preventDefault();
			this.events.emit('orderStepTwo:handleNextStep');
		});
	}

	reset() {
		this.phoneInput.value = '';
		this.emailInput.value = '';
		this.formButton.disabled = true;
	}

	updateError(value: string) {
		this.error.textContent = value;
	}

	// close(): void {
	// 	this.events.emit('orderStepTwo:close');
	// }

	render(data?: IModalData): HTMLElement {
		// Костыль
		if (!data) {
			data = {};
		}
		// Костыль
		this.container.classList.remove('step-three-modal');

		data.content = this.formContent;

		return super.render(data);
	}
}

// Третий шаг

export class OrderStepThreeModal extends Modal {
	formContent: HTMLElement;
	successDescription: HTMLElement;
	formButton: HTMLButtonElement;

	constructor(
		container: HTMLElement,
		protected model: OrderModel,
		events: IEvents
	) {
		super(container, events);
		// this.container.addEventListener('click', () => {
		// 	this.events.emit('orderStepThree:close');
		// });
		this.formContent = ensureElement<HTMLTemplateElement>(
			'#success'
		).content.firstElementChild?.cloneNode(true) as HTMLElement;
		this.formButton = ensureElement<HTMLButtonElement>(
			'.order-success__close',
			this.formContent
		);
		this.successDescription = ensureElement<HTMLElement>(
			'.order-success__description',
			this.formContent
		);

		this.formButton.addEventListener('click', () => {
			this.events.emit('orderStepThree:close');
		});
	}

	render(data?: IModalData): HTMLElement {
		// Костыль
		if (!data) {
			data = {};
		}

		// Костыль
		this.container.classList.add('step-three-modal');

		this.successDescription.textContent = `Списано ${this.model.total} синапсов`;

		data.content = this.formContent;

		return super.render(data);
	}
}
