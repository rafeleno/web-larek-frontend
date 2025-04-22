# ENGLISH

# Project Work "Веб-ларек"

Stack: HTML, SCSS, TS, Webpack

Project structure:

- src/ — source files of the project
- src/components/ — folder with JS components
- src/components/base/ — folder with base code

Important files:

- src/pages/index.html — main page HTML file
- src/types/index.ts — file with types
- src/index.ts — application entry point
- src/scss/styles.scss — root styles file
- src/utils/constants.ts — file with constants
- src/utils/utils.ts — file with utilities

## Installation and Launch

To install and start the project, run the commands

```
npm install
npm run start
```

or

```
yarn
yarn start
```

## Build

```
npm run build
```

or

```
yarn build
```

## Architecture

### Data

Card (Card methods: 'Add to cart', 'Remove from cart')

- Name
- Price
- Image
- Tag

User

- Email
- Phone
- Address

## Components

- Card collection (Methods: 'Load actual cards')
- Card
- Cart (modal) (Methods: 'Load cards', 'Place order')
- Payment and address modal (Methods: 'Return address and payment method')
- Contacts modal (Methods: 'Return contacts')
- Order confirmation modal

## Types

### Types were created for class implementation:

### Header

```ts
export interface IHeader {
	cart: ICart;
	img: string;
	link: string;
}

export interface IHeaderView {
	render(data: { cart: ICart; imageUrl: string; linkUrl: string }): void;
	hide(): void;
	onCartClick(): void;
}
```

### The component lacks a model as it contains no logic, only displays elements and attaches event listeners

#### IHeader

The "Header" class stores information to display it in the header

#### IHeaderView

The "HeaderView" class handles rendering the header and listening to its elements’ events

### MainPage

```ts
export interface IMainPage {
	cardsCollection: ICardCollection;
}

export interface IMainPageView {
	render(data: { cart: ICart; imageUrl: string; linkUrl: string }): void;
	hide(): void;
	onCardClick(): void;
}
```

### This component also lacks a model, as it contains no logic, only displays elements and attaches event listeners

#### IMainPage

The "MainPage" class stores information to display on the page

#### IMainPageView

The "MainPageView" class handles displaying the information

### Card

```ts
export interface ICard {
	cardName: string;
	cardDescription: string;
	cardImage: string;
	cardTag: TTag;
}

export interface ICardModel {
	addToCart(product: ICard): void;
	removeFromCart(id: number): void;
	getCard(): ICard;
	render(): HTMLElement;
}

export interface ICardMainView {
	render(): void;
	onClick(): void;
}

export interface ICardModalView {
	render(): void;
	onClose(): void;
	onClick(handler: (id: string) => void): void;
}

export interface ICardSmallView {
	render(): void;
	onRemove(handler: (id: string) => void): void;
}
```

#### "ICard"

The Card class stores all the information about a specific card

#### "ICardModel"

The CardModel class contains all the logic for interacting with the card

#### "CardMainView, CardModalView, CardSmallView"

These classes are responsible for rendering different variations of the card — on the main page, in the modal, and in the cart

### CardCollection

```ts
export interface ICardCollection {
	cards: ICard[];
}

export interface ICardCollectionModel {
	setCards(cards: ICard[]): void;
	getCards(): ICard[];
}

export interface ICardCollectionView {
	render(cards: ICard[]): void;
}
```

#### "ICardCollection"

The СardCollectionModel class stores the card collection data

#### "ICardCollectionModel"

The CardCollectionModel class is the model. It allows you to get and set the array of cards

#### "ICardCollectionView"

The CardCollectionView class is responsible for displaying the cards

## PayMethod

```ts
export type TPayMethod = 'cash' | 'non-cash';
```

#### "TPayMethod"

Type defines payment options

### Order

```ts
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
	price: number;
	render(): void;
	hide(): void;
}
```

#### "IOrder"

The Order class stores all the information about a specific order

#### "IOrderModel"

The OrderModel class contains all the logic for interacting with the order.  
It acts like a builder and collects pieces of data at each checkout step

#### "IOrderStepOneModel, IOrderStepTwoModel, IOrderStepThreeModel"

```ts
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
	_price: number;
	setPrice(): void;
	render(): void;
	hide(): void;
}
```

OrderStepOneModel, OrderStepTwoModel, and OrderStepThreeModel classes contain the logic for each checkout step modal. They pass data to the order model.  
Step one is typed for payment method and address, step two for email and phone number, step three can store the final price

#### "IOrderStepOneView, IOrderStepTwoView, IOrderStepThreeView"

```ts
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
```

OrderStepOneView, OrderStepTwoView, and OrderStepThreeView classes handle the rendering of different steps of the purchase process

### Cart

```ts
export interface ICart {
	cards: ICard[];
	totalPrice: number;
}

export interface ICartModel {
	getTotalPrice(): number;
	setTotalPrice(): void;
	getCards(): ICard[];
	setCards(): ICard[];
}

export interface ICartView {
	render(cards: ICard[], totalPrice: number): void;
	hide(): void;
}
```

#### ICart

The "Cart" class stores all information about items in the cart

#### ICartModel

The "CartModel" class contains logic. It can get and set the total price of items and manage the cards array

#### ICartView

The "CartView" class handles displaying and hiding the cart

### IController

The "Controller" class — controller

# РУССКИЙ

# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:

- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:

- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск

Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```

## Сборка

```
npm run build
```

или

```
yarn build
```

## Архитектура

### Данные

Карта(Методы карты: 'Добавить в корзину', 'Удалить из карзины')

- Наименование
- Стоиомть
- Картинка
- Тэг

Пользователь

- Почта
- Телефона
- Адрес

## Компоненты

- Коллекция карт(Методы: 'Загрузить актуальные карты')
- Карта
- Конрзина(модалка)(Методы: 'Загрузить карты', 'Оформить заказ')
- Модалка оплаты и адреса(Методы: 'Вернуть адрес и способ оплаты')
- Модалка контактов(Методы: 'Вернуть контакты')
- Модалка заказ оформлен

## Типы

### Для реализации классов были соззданы типы:

### Header

```ts
export interface IHeader {
	cart: ICart;
	img: string;
	link: string;
}

export interface IHeaderView {
	render(data: { cart: ICart; imageUrl: string; linkUrl: string }): void;
	hide(): void;
	onCartClick(): void;
}
```

### Компонент обделен моделью, так как не содержит в себе никакой логики, а только отображает элеемнты и вешает слушатели

#### IHeader

Класс "Header" хронит информацию для вывода ее в шапку

#### IHeaderView

Класс "HeaderView" отвечает за вывод шапки и соушатели событый ее элементов

### MainPage

```ts
export interface IMainPage {
	cardsCollection: ICardCollection;
}

export interface IMainPageView {
	render(data: { cart: ICart; imageUrl: string; linkUrl: string }): void;
	hide(): void;
	onCardClick(): void;
}
```

### Компонент тоже обделен моделью, так как не содержит в себе никакой логики, а только отображает элеемнты и вешает слушатели

#### IMainPage

Класс "MainPage" хронит информацию для вывода ее на страницу

#### IMainPageView

Класс "MainPageView" отвечает за вывод информации

### Card

```ts
export interface ICard {
	cardName: string;
	cardDescription: string;
	cardImage: string;
	cardTag: TTag;
}

export interface ICardModel {
	addToCart(product: ICard): void;
	removeFromCart(id: number): void;
	getCard(): ICard;
	render(): HTMLElement;
}

export interface ICardMainView {
	render(): void;
	onClick(): void;
}

export interface ICardModalView {
	render(): void;
	onClose(): void;
	onClick(handler: (id: string) => void): void;
}

export interface ICardSmallView {
	render(): void;
	onRemove(handler: (id: string) => void): void;
}
```

#### "ICard"

Класс Card будет хранит всю информацию о конкретной карте

#### "ICardModel"

Класс CardModel будет Хранит всю логику для взаимодействия с картой

#### "CardMainView, CardModalView, CardSmallView"

Классы CardMainView, CardModalView, CardSmallView Отвечают за отображение разных вариантов карточки - на главной странице, в контексте попапа и в корзине

### CardCollection

```ts
export interface ICardCollection {
	cards: ICard[];
}

export interface ICardCollectionModel {
	setCards(cards: ICard[]): void;
	getCards(): ICard[];
}

export interface ICardCollectionView {
	render(cards: ICard[]): void;
}
```

#### "ICardCollection"

Класс СardCollectionModel будет хранит данные коллекции

#####"ICardCollectionModel"

Класс ardCollectionModel модель. дает возможность забрать и отдать массив карт

#### "ICardCollectionView"

Класс CardCollectionView займется выводом карточек

## PayMethod

```ts
export type TPayMethod = 'cash' | 'non-cash';
```

#### "TPayMethod"

Типизирует варианты оплаты

### Order

```ts
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
	price: number;
	render(): void;
	hide(): void;
}
```

#### "IOrder"

Класс Order будет хранить всю информацию о конкретной карте

#### "IOrderModel"

Класс OrderModel будет хранит всю логику для взаимодействия с картой.\
Он выполнен как билдер и на каждом этапе оформления заказа будет собирать части данных для оформления заказа

#### "IOrderStepOneModel, IOrderStepTwoModel, IOrderStepThreeModel"

```ts
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
	_price: number;
	setPrice(): void;
	render(): void;
	hide(): void;
}
```

Классы OrderStepOneModel, OrderStepTwoModel, OrderStepThreeModel хранят логику окон шагов покупки. Они умеют отпралять данные в модель оформления заказа. Функции первого шага заранее типизированы под тип оплаты и адрес, функции второго под email и номер телефона, третий может хранить итоговую стоимость

#### "IOrderStepOneView, IOrderStepTwoView, IOrderStepThreeView"

```ts
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
```

Классы OrderStepOneView, OrderStepTwoView, OrderStepThreeView занимаются отображением разных этапов покупки

### Cart

```ts
export interface ICart {
	cards: ICard[];
	totalPrice: number;
}

export interface ICartModel {
	getTotalPrice(): number;
	setTotalPrice(): void;
	getCards(): ICard[];
	setCards(): ICard[];
}

export interface ICartView {
	render(cards: ICard[], totalPrice: number): void;
	hide(): void;
}
```

#### ICart

Класс "Cart" хранит всю информацию о таварах в корзине

#### ICartModel

Класс "CartModel" - логика. Он умеет получать и отдовать общую стоимость товаров товаров, также получать и отдовать сами карты

#### ICartView

Класс "CartView" - Отображение. Он отображать корзину и прятать ее

### IController

Класс "Controller" - контроллер
