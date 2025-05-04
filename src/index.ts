import { Api } from './components/base/api';
import { EventEmitter, IEvents } from './components/base/events';
import { CardModal, CardView } from './components/card';
import {
	CardCollectionModel,
	CardCollectionView,
} from './components/CardCollection';
import { BasketCardData, CartModel, CartView, Id } from './components/cart';
import { HeaderModel, HeaderView } from './components/header';
import './scss/styles.scss';
import { ICardModel } from './types/card';

import { API_URL, CDN_URL, settings } from './utils/constants';
import { ensureElement } from './utils/utils';

const events = new EventEmitter();

const CardsApi = new Api(API_URL, settings);

const CardCollectionContainer = ensureElement<HTMLElement>('.gallery');

// офлайн пример
const exampleCards: ICardModel[] = [
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
	const data = res as { items: ICardModel[] };

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
	ensureElement<HTMLElement>('#modal-container'),
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

events.on('card:click', (data: ICardModel) => {
	ModalCard.model = data;

	ModalCard.render({});
});

const Cart = new CartModel();
const CartV = new CartView(
	ensureElement<HTMLElement>('#modal-container'),
	Cart,
	CardsApi,
	events
);

events.on('card:buy', (data: Id[]) => {
	Cart.addCards(data);
	HeaderV.updateCounter();
});

events.on('cart:cardRemoved', (data: BasketCardData) => {
	Cart.removeCards(data.id);
	CartV.updateCards();

	console.log(Cart._cards);
	console.log(Cart._price);
});

const headerContainer = ensureElement<HTMLElement>('header');

const Header = new HeaderModel(Cart);
const HeaderV = new HeaderView(headerContainer, Header, events);

events.on('cart:click', () => {
	CartV.render({});
	Header.updateCounter();
});
HeaderV.render();
