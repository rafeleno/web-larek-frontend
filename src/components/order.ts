import { TPayMethod } from '../types/order';
import { ensureElement } from '../utils/utils';
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
	payment: TPayMethod = 'empty';
	email = '';
	phone = '';
	address = '';
	total = 0;
	items: Id[] = [];

	addData(data: Partial<OrderModel>) {
		Object.assign(this, data);
	}

	get data(): OrderData {
		return {
			payment: this.payment,
			email: this.email,
			phone: this.phone,
			address: this.address,
			total: this.total,
			items: this.items,
		};
	}

	stepOneIsValid({
		value,
		regExp,
		Modal,
	}: {
		value: string;
		regExp: RegExp;
		Modal: OrderStepOneModal;
	}) {
		if (typeof value !== 'string' || !(regExp instanceof RegExp)) {
			return false;
		}
		if (
			!Modal.buttonCash.classList.contains('button_alt-active') &&
			!Modal.buttonCard.classList.contains('button_alt-active')
		) {
			return false;
		}
		return regExp.test(value);
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

		data.content = this.formContent;

		return super.render(data);
	}
}

// // Второй шаг

// export class OrderStepTwoModal extends Modal {
// 	constructor(container: HTMLElement, events: IEvents) {
// 		super(container, events);
// 	}

// 	// TODO:
// 	formContent = ensureElement<HTMLTemplateElement>(
// 		'#contacts'
// 	).content.firstElementChild?.cloneNode(true) as HTMLElement;

// 	emailInput = ensureElement<HTMLInputElement>(
// 		'[name="email"]',
// 		this.formContent
// 	);
//   phoneInput = ensureElement<HTMLInputElement>(
// 		'[name="phone"]',
// 		this.formContent
// 	);
// 	// TODO:
// 	formButton = ensureElement<HTMLButtonElement>(
// 		'.order__button',
// 		this.formContent
// 	);

// 	render(data?: IModalData): HTMLElement {
// 		// Костыль
// 		if (!data) {
// 			data = {};
// 		}

// 		this.buttonCard.addEventListener('click', () => {
// 			this.buttonCard.classList.add('button_alt-active');
// 			this.buttonCash.classList.remove('button_alt-active');
// 			// }

// 			this.events.emit('order:card');
// 		});

// 		this.buttonCash.addEventListener('click', () => {
// 			this.buttonCash.classList.add('button_alt-active');
// 			this.buttonCard.classList.remove('button_alt-active');

// 			this.events.emit('order:cash');
// 		});

// 		this.addressInput.addEventListener('input', () => {
// 			this.events.emit('addressInput:input');
// 		});

// 		data.content = this.formContent;

// 		return super.render(data);
// 	}
// }
