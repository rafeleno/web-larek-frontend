import { TPayMethod } from '../types/order';
import { ensureElement } from '../utils/utils';
import { Api } from './base/api';
import { IEvents } from './base/events';
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
	protected _total = 0;
	protected _items: Id[] = [];
	protected emailValidState = false;
	protected phoneValidState = false;

	constructor(protected api: Api) {}

	addData(data: Partial<OrderModel>) {
		Object.assign(this, data);
	}

	get payment() {
		return this._payment;
	}
	set payment(value) {
		this._payment = value;
	}
	get email() {
		return this._email;
	}
	set email(value) {
		this._email = value;
	}
	get phone() {
		return this._phone;
	}
	set phone(value) {
		this._phone = value;
	}
	get address() {
		return this._address;
	}
	set address(value) {
		this._address = value;
	}
	get total(): number {
		return this._total;
	}
	get items() {
		return this._items;
	}
	set items(value: Id[]) {
		this._items = value;
	}

	stepOneIsValid(modal: OrderStepOneModal): boolean {
		if (
			!modal.buttonCash.classList.contains('button_alt-active') &&
			!modal.buttonCard.classList.contains('button_alt-active')
		) {
			return false;
		}
		if (modal.addressInput.value.length < 1) {
			return false;
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

	stepTwoIsValid() {
		console.log(this.emailValidState && this.phoneValidState);
		return this.emailValidState && this.phoneValidState;
	}

	// КОСТЫЛЬ ИЗ-ЗА НЕУДАЧНОГО РЕШЕНИЯ РАБОТАТЬ С МАССИВОМ ID А НЕ ЦЕЛЫМИ КАРТАМИ
	postData(data: {
		paymentValue: TPayMethod;
		emailValue: string;
		phoneValue: string;
		addressValue: string;
		totalValue: number;
		itemsValue: Id[];
	}) {
		this.api.post('/order', data);
		console.log();
	}
}

export class OrderStepOneModal extends Modal {
	constructor(container: HTMLElement, events: IEvents) {
		super(container, events);
	}

	// TODO:
	formContent = ensureElement<HTMLTemplateElement>(
		'#order'
	).content.firstElementChild?.cloneNode(true) as HTMLElement;
	buttonCard = ensureElement<HTMLButtonElement>(
		'[name="card"]',
		this.formContent
	);
	buttonCash = ensureElement<HTMLButtonElement>(
		'[name="cash"]',
		this.formContent
	);
	addressInput = ensureElement<HTMLInputElement>(
		'[name="address"]',
		this.formContent
	);
	// TODO:
	formButton = ensureElement<HTMLButtonElement>(
		'.order__button',
		this.formContent
	);

	render(data?: IModalData): HTMLElement {
		// Костыль
		if (!data) {
			data = {};
		}

		this.buttonCard.addEventListener('click', () => {
			this.buttonCard.classList.add('button_alt-active');
			this.buttonCash.classList.remove('button_alt-active');
			// }

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
		data.content = this.formContent;

		return super.render(data);
	}
}

// Второй шаг

export class OrderStepTwoModal extends Modal {
	constructor(container: HTMLElement, events: IEvents) {
		super(container, events);
	}

	// TODO:
	formContent = ensureElement<HTMLTemplateElement>(
		'#contacts'
	).content.firstElementChild?.cloneNode(true) as HTMLElement;

	emailInput = ensureElement<HTMLInputElement>(
		'[name="email"]',
		this.formContent
	);
	phoneInput = ensureElement<HTMLInputElement>(
		'[name="phone"]',
		this.formContent
	);
	// TODO:
	formButton = ensureElement<HTMLButtonElement>('.button', this.formContent);

	render(data?: IModalData): HTMLElement {
		// Костыль
		if (!data) {
			data = {};
		}

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

		data.content = this.formContent;

		return super.render(data);
	}
}

// Третий шаг

export class OrderStepThreeModal extends Modal {
	constructor(
		container: HTMLElement,
		protected model: OrderModel,
		events: IEvents
	) {
		super(container, events);
	}

	// TODO:
	formContent = ensureElement<HTMLTemplateElement>(
		'#success'
	).content.firstElementChild?.cloneNode(true) as HTMLElement;
	formButton = ensureElement<HTMLButtonElement>(
		'.order-success__close',
		this.formContent
	);
	successDescription = ensureElement<HTMLElement>(
		'.order-success__description',
		this.formContent
	);

	render(data?: IModalData): HTMLElement {
		// Костыль
		if (!data) {
			data = {};
		}

		this.successDescription.textContent = `Списано ${this.model.total} синапсов`;

		this.formButton.addEventListener('click', () => {
			this.events.emit('order:success');
		});
		data.content = this.formContent;

		return super.render(data);
	}
}
