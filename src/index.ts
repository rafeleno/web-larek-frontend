import { Api } from './components/base/api';
import { EventEmitter, IEvents } from './components/base/events';
import { Card, CardModal, CardView } from './components/card';
import {
	CardCollectionModel,
	CardCollectionView,
} from './components/CardCollection';
import { BasketCardData, CartModel, CartView, Id } from './components/cart';
import { HeaderModel, HeaderView } from './components/header';
import {
	OrderModel,
	OrderStepOneModal,
	OrderStepThreeModal,
	OrderStepTwoModal,
} from './components/order';
import './scss/styles.scss';
import { ICardData } from './types/card';

import { API_URL, CDN_URL, settings } from './utils/constants';
import { ensureElement } from './utils/utils';

const events = new EventEmitter();

const CardsApi = new Api(API_URL, settings);

const CardCollectionContainer = ensureElement<HTMLElement>('.gallery');
const modalContainer = ensureElement<HTMLElement>('#modal-container');

// Init
CardsApi.get('/product/').then((res) => {
	const data = res as { items: ICardData[] };
	const newCards: Card[] = [];
	data.items.forEach((cardDataElement) => {
		newCards.push(
			new Card(
				cardDataElement.id,
				cardDataElement.image,
				cardDataElement.price,
				cardDataElement.title,
				cardDataElement.description,
				cardDataElement.category
			)
		);
	});

	const CardCollection = new CardCollectionModel(newCards);
	const CrdCollectionView = new CardCollectionView(
		CardCollectionContainer,
		CardCollection,
		CDN_URL,
		CardView,
		events
	);

	CrdCollectionView.render();
	const cardsForPost = CardCollection.cards;
	return cardsForPost;
});

// init;
const ModalCard: CardModal = new CardModal(
	modalContainer,
	new Card('666', 'example', 0, 'example', 'example', 'софт-скил'),
	events,
	CDN_URL
);

events.on('card:click', (data: Card) => {
	data.isInCart(Cart.cards);

	ModalCard.model = data;
	ModalCard.render();
});

const Cart = new CartModel(CardsApi);
const CartV = new CartView(
	modalContainer,
	Cart,

	events
);

events.on('cardModal:buy', (cardModal: CardModal) => {
	Cart.addCards(cardModal.model.cardData);
	cardModal.blockButton(true);
	HeaderV.updateCounter();
});

events.on('cardModal:close', (cardModal: CardModal) => {
	cardModal.blockButton(false);
});

events.on('cart:cardRemoved', (data: BasketCardData) => {
	Cart.removeCards(data.id);
	CartV.updateCards();
});

events.on('cart:handleNextStep', () => {
	StepOneModal.render();
});

const headerContainer = ensureElement<HTMLElement>('header');

const Header = new HeaderModel(Cart);
const HeaderV = new HeaderView(headerContainer, Header, events);

events.on('cart:click', () => {
	CartV.render();
	Header.updateCounter();
});
HeaderV.render();

const Order = new OrderModel(CardsApi);

// ШАГ 1 -----------------------------------------------------

const StepOneModal = new OrderStepOneModal(modalContainer, events);
const StepTwoModal = new OrderStepTwoModal(modalContainer, events);

const OrderEmailInput = ensureElement<HTMLInputElement>(
	'[name="email"]',
	StepTwoModal.formContent
);
const OrderPhoneInput = ensureElement<HTMLInputElement>(
	'[name="phone"]',
	StepTwoModal.formContent
);
const OrderAddressInput = ensureElement<HTMLInputElement>(
	'[name="address"]',
	StepOneModal.formContent
);

events.on('order:card', () => {
	Order.payment = 'non-cash';

	if (Order.stepOneIsValid(StepOneModal) === false) {
		StepOneModal.formButton.disabled = true;
	} else {
		StepOneModal.formButton.disabled = false;
	}
});

events.on('order:cash', () => {
	Order.payment = 'cash';
	// Order.addData

	if (Order.stepOneIsValid(StepOneModal) === false) {
		StepOneModal.formButton.disabled = true;
	} else {
		StepOneModal.formButton.disabled = false;
	}
});

// value: StepOneModalAddressInput.value,
events.on('addressInput:input', () => {
	if (Order.stepOneIsValid(StepOneModal) === false) {
		StepOneModal.formButton.disabled = true;
	} else {
		StepOneModal.formButton.disabled = false;
	}
});

events.on('orderStepOne:handleNextStep', () => {
	StepTwoModal.render();
	Order.address = OrderAddressInput.value;
	Order.items = Cart.cards;
	// Order.addData({
	// 	address: Order.address,
	// 	payment: Order.payment,
	// });
});

// TODO: Возможно лучне передавать элементы во View(да)

// ШАГ 2 -----------------------------------------------------

events.on('emailInput:input', () => {
	Order.emailIsValid(OrderEmailInput.value);
	if (Order.stepTwoIsValid()) {
		StepTwoModal.formButton.disabled = false;
	} else StepTwoModal.formButton.disabled = true;
});

events.on('phoneInput:input', () => {
	Order.phoneIsValid(OrderPhoneInput.value);
	if (Order.stepTwoIsValid()) {
		StepTwoModal.formButton.disabled = false;
	} else StepTwoModal.formButton.disabled = true;
});

events.on('orderStepTwo:handleNextStep', () => {
	Order.email = OrderEmailInput.value;
	Order.phone = OrderPhoneInput.value;
	// Order.items = Order.addData({ email: Order.email, phone: Order.phone });
	Order.post();
	stepOneThreeModal.render();
});

// ШАГ 3 -----------------------------------------------------

const stepOneThreeModal = new OrderStepThreeModal(
	modalContainer,
	Order,
	events
);

events.on('order:success', () => {
	stepOneThreeModal.close();
	Cart.reset();
	Header.updateCounter();
	HeaderV.updateCounter();
});
