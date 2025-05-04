import { Api } from './components/base/api';
import { EventEmitter, IEvents } from './components/base/events';
import { CardModal, CardView } from './components/card';
import {
	CardCollectionModel,
	CardCollectionView,
} from './components/CardCollection';
import { BasketCardData, CartModel, CartView, Id } from './components/cart';
import { HeaderModel, HeaderView } from './components/header';
import { OrderModel, OrderStepOneModal } from './components/order';
import './scss/styles.scss';
import { ICardData } from './types/card';

import { API_URL, CDN_URL, settings } from './utils/constants';
import { ensureElement } from './utils/utils';

const events = new EventEmitter();

const CardsApi = new Api(API_URL, settings);

const emailRegExp = /^[\p{L}0-9._%+-]+@[\p{L}0-9.-]+\.[\p{L}]{2,}$/u;

const CardCollectionContainer = ensureElement<HTMLElement>('.gallery');
const modalContainer = ensureElement<HTMLElement>('#modal-container');

// офлайн пример
const exampleCards: ICardData[] = [
	{
		id: 'ajdlajdlkjalsdk',
		image: '/ladjla',
		price: '1000',
		title: 'title',
		description: 'description',
		category: 'дополнительное',
	},
	{
		id: 'ajdlajdlkjalsdk',
		image: '/ladjla',
		price: '1000',
		title: 'title',
		description: 'description',
		category: 'дополнительное',
	},
	{
		id: 'ajdlajdlkjalsdk',
		image: '/ladjla',
		price: '1000',
		title: 'title',
		description: 'description',
		category: 'дополнительное',
	},
	{
		id: 'ajdlajdlkjalsdk',
		image: '/ladjla',
		price: '1000',
		title: 'title',
		description: 'description',
		category: 'дополнительное',
	},
];

// Init
CardsApi.get('/product/').then((res) => {
	const data = res as { items: ICardData[] };

	const CardCollection = new CardCollectionModel(data.items);
	const CrdCollectionView = new CardCollectionView(
		CardCollectionContainer,
		CardCollection,
		CDN_URL,
		CardView,
		events
	);

	CrdCollectionView.render();
});

// // Пример;
const ModalCard: CardModal = new CardModal(
	modalContainer,
	{
		id: '666',
		description: 'example',
		image: 'example',
		title: 'example',
		category: 'софт-скил',
		price: 'example',
	},
	events,
	CDN_URL
);

events.on('card:click', (data: ICardData) => {
	ModalCard.model = data;

	ModalCard.render();
});

const Cart = new CartModel(CardsApi);
const CartV = new CartView(
	modalContainer,
	Cart,

	events
);

events.on('card:buy', (data: Id[]) => {
	Cart.addCards(data);
	HeaderV.updateCounter();
});

events.on('cart:cardRemoved', (data: BasketCardData) => {
	Cart.removeCards(data.id);
	CartV.updateCards();
});

const headerContainer = ensureElement<HTMLElement>('header');

const Header = new HeaderModel(Cart);
const HeaderV = new HeaderView(headerContainer, Header, events);

events.on('cart:click', () => {
	CartV.render();
	Header.updateCounter();
});
HeaderV.render();

const Order = new OrderModel();
const StepOneModal = new OrderStepOneModal(modalContainer, events);

const StepOneModalAddressInput = ensureElement<HTMLInputElement>(
	'[name="address"]',
	StepOneModal.formContent
);

events.on('order:card', () => {
	Order.addData({ payment: 'non-cash' });

	if (
		Order.stepOneIsValid({
			value: StepOneModalAddressInput.value,
			regExp: emailRegExp,
			Modal: StepOneModal,
		})
	) {
		StepOneModal.formButton.removeAttribute('disabled');
	} else {
		StepOneModal.formButton.disabled = true;
	}

	console.log(Order.payment);
});

events.on('order:cash', () => {
	Order.addData({ payment: 'cash' });

	if (
		Order.stepOneIsValid({
			value: StepOneModalAddressInput.value,
			regExp: emailRegExp,
			Modal: StepOneModal,
		})
	) {
		StepOneModal.formButton.removeAttribute('disabled');
	} else {
		StepOneModal.formButton.disabled = true;
	}

	console.log(Order.payment);
});

events.on('addressInput:input', () => {
	if (
		Order.stepOneIsValid({
			value: StepOneModalAddressInput.value,
			regExp: emailRegExp,
			Modal: StepOneModal,
		})
	) {
		StepOneModal.formButton.removeAttribute('disabled');
	} else {
		StepOneModal.formButton.disabled = true;
	}
});

// TODO: Возможно лучне передавать элементы во View(да)
