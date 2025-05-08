import { Api } from './components/base/api';
import { EventEmitter } from './components/base/events';
import { Card, CardModal, CardView } from './components/card';
import {
	CardCollectionModel,
	CardCollectionView,
} from './components/CardCollection';
import {
	BasketCardData,
	BasketItemView,
	CartModel,
	CartView,
} from './components/cart';
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
const pageElement = ensureElement<HTMLElement>('.page');
const headerContainer = ensureElement<HTMLElement>('header');

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

	const cardColView = new CardCollectionView(
		CardCollectionContainer,
		CardCollection,
		CDN_URL,
		CardView,
		events
	);

	cardColView.render();
	const cardsForPost = CardCollection.cards;
	return cardsForPost;
});

const ModalCard: CardModal = new CardModal(
	modalContainer,
	new Card('666', 'example', 0, 'example', 'example', 'софт-скил'),
	events,
	CDN_URL
);

const Cart = new CartModel(CardsApi);
const cartUI = new CartView(modalContainer, Cart, events, BasketItemView);

const Header = new HeaderModel(Cart);
const HeaderUI = new HeaderView(headerContainer, Header, events);
HeaderUI.render();

const Order = new OrderModel(CardsApi);
const StepOneModal = new OrderStepOneModal(modalContainer, events);
const StepTwoModal = new OrderStepTwoModal(modalContainer, events);
const stepThreeModal = new OrderStepThreeModal(modalContainer, Order, events);

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

function validateStepOne() {
	Order.stepOneIsValid(StepOneModal);

	const { status, errors } = Order.stepOneErrorState;

	if (status === 'error') {
		StepOneModal.formButton.disabled = true;

		if (errors === 'address') {
			StepOneModal.updateError('Введите адрес');
		} else if (errors === 'payMethod') {
			StepOneModal.updateError('Выберите метод оплаты');
		}
	} else {
		StepOneModal.updateError('');
		StepOneModal.formButton.disabled = false;
	}
}

function validateStepTwo() {
	Order.emailIsValid(OrderEmailInput.value);
	Order.phoneIsValid(OrderPhoneInput.value);
	Order.stepTwoIsValid();

	const { status, errors } = Order.stepTwoErrorState;

	if (status === 'error') {
		StepTwoModal.formButton.disabled = true;
		StepTwoModal.error.textContent =
			errors === 'email'
				? 'Укажите свою почту'
				: errors === 'phone'
				? 'Укажите свой номер телефона'
				: '';
	} else {
		StepTwoModal.error.textContent = '';
		StepTwoModal.formButton.disabled = false;
	}
}

events.on('orderStepThree:close', () => {
	if (modalContainer.classList.contains('step-three-modal')) {
		stepThreeModal.close();
	}
});

events.on('modal:open', () => {
	pageElement.classList.add('page_locked');
});
events.on('modal:close', () => {
	pageElement.classList.remove('page_locked');
});

events.on('addressInput:input', validateStepOne);

events.on('card:click', (data: Card) => {
	data.isInCart(Cart.cards);

	ModalCard.model = data;
	ModalCard.render();
});

events.on('cardModal:buy', (cardModal: CardModal) => {
	if (Cart.cards.some((card) => card.id === cardModal.model.cardData.id)) {
		return;
	}
	Cart.addCards(cardModal.model.cardData);
	cardModal.close();

	HeaderUI.updateCounter();
});

events.on('cardModal:close', (cardModal: CardModal) => {
	cardModal.blockButton(false);
});

events.on('cart:cardRemoved', (data: BasketCardData) => {
	Cart.removeCards(data.id);
	cartUI.updateCards();

	Cart.checkCartIsEmpty();
	cartUI.disableCartButton(Cart.cartEmptyStatus);

	Header.updateCounter();
	HeaderUI.updateCounter();
});

events.on('cart:handleNextStep', () => {
	StepOneModal.render();
});

events.on('order:card', () => {
	Order.payment = 'non-cash';
	validateStepOne();
});

events.on('order:cash', () => {
	Order.payment = 'cash';
	validateStepOne();
});

events.on('cart:click', () => {
	cartUI.render();
	Header.updateCounter();

	Cart.checkCartIsEmpty();
	cartUI.disableCartButton(Cart.cartEmptyStatus);
});

events.on('orderStepOne:handleNextStep', () => {
	StepTwoModal.render();
	Order.address = OrderAddressInput.value;
	Order.items = Cart.cards;
});

events.on('emailInput:input', validateStepTwo);
events.on('phoneInput:input', validateStepTwo);

events.on('orderStepTwo:handleNextStep', () => {
	Order.email = OrderEmailInput.value;
	Order.phone = OrderPhoneInput.value;

	Order.post().then((res) => {
		stepThreeModal.render();
		Cart.reset();
		cartUI.updateCards();
		StepOneModal.reset();
		StepTwoModal.reset();
		Header.updateCounter();
		HeaderUI.updateCounter();
	});
});
