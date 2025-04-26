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

## Архитектура MVP(Model View Presenter)

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
- Родительское модальное окно(Методы: 'Отобразить переданные контент')
- Модалка оплаты и адреса(Методы: 'Вернуть адрес и способ оплаты') (Насладует родительское модальное окно)\*
- Модалка контактов(Методы: 'Вернуть контакты') (Насладует родительское модальное окно)\*
- Модалка заказ оформлен

## Классы

#### Для реализации были соззданы классы:

### `Modal`

класс `Modal` расширяет базовый компонент, для работы с модальным окном.

Он нужен для того, чтобы открывать и закрывать модальное окно, заменять содержимое, оповещать остальную часть приложения через систему событий `IEvents`.

Структура

`container: HTMLElement` — корневой HTML-элемент модального окна.

`events: IEvents` — объект для отправки/получения событий.

`\_closeButton: HTMLButtonElement` — кнопка закрытия.

`\_content: HTMLElement` — область для динамического контента.

Методы

`set content(value: HTMLElement): void` - заменяет текущее содержимое в модальном окне.

`open(): void` - делает модальное окно видимым. Вызывает событие modal:open.

`close(): void` - скрывает модальное окно, очищает содержимое, вызывает событие modal:close.

`render(data: IModalData): HTMLElement` - отображает новые данные в модальном окне и открывает его.

Класс имплементирует интерфейс `IModal`:

```ts
export interface IModal {
	open(): void;
	close(): void;
	render(data: IModalData): HTMLElement;
	content: HTMLElement | null;
}
```

##### Тип `IModalData` - Типизирует контент принимаемый модальным окном:

```ts
export interface IModalData {
	content: HTMLElement;
}
```

#### Важные детали

Закрытие по кнопке и клику по задниму.

Клик внутри контента не приводит к закрытию модалки.

Общение с внешним миром через IEvents, что делает Modal более гибким.

### `MainPageModel`

Класс `MainPageModel` нужен для того, чтобы управлять коллекцией карточек на главной странице.

`constructor` принимает модель коллекции карточек:

```ts
constructor(cardCollection: ICardCollectionModel)
```

Класс `MainPageModel` содержит методы для работы с коллекцией карточек:

- `cardCollection: ICardCollectionModel` - Коллекция карточек.
- `getCollection(): void` - Метод для получения коллекции карточек.
- `setCollection(): void` - Метод для установки коллекции карточек.

Класс `MainPageModel` имплементирует интерфейс `IMainPageModel`

```ts
export interface IMainPageModel {
	cardCollection: ICardCollectionModel;
	getCollection(): void;
	setCollection(): void;
}
```

### `MainPageView`

Класс `MainPageView` нужен для того, чтобы отображать коллекцию карточек на главной странице.

`constructor` принимает контейнер для отображения карточек.

```ts
constructor(container: HTMLElement)
```

Класс `MainPageView` содержит метод для работы с отображением:

`render(data: ICardCollectionModel): void` - Метод принимает коллекцию карточек и отображает её на странице.

Класс `MainPageView` имплементирует интерфейс `IMainPageView`

```ts
export interface IMainPageView {
	render(data: ICardCollectionModel): void;
}
```

### `MainPagePresenter`

Класс `MainPagePresenter` нужен для того, чтобы соединить модель и отображение главной страницы.

Класс `MainPagePresenter` хранит метод для инициализации главной страницы:

- `init(): void` - Метод для инициализации отображения коллекции карточек.

Класс `MainPagePresenter` имплементирует интерфейс `IMainPagePresenter`

```ts
export interface IMainPagePresenter {
	init(): void;
}
```

### `HeaderModel`

Класс `HeaderModel` нужен для того, чтобы хранить данные логотипа в шапке сайта(изображжение и ссылку), и элемент корзины в шапке сайта

#### `constructor`

Принимает данные шапи сайте:

```ts
constructor(logoImg: string, logoLink: string, cartImg: string)
```

Класс `HeaderModel` содержит данные шапки:

- `logoImg: string;` - Имя карточки
- `logoLink: string;` - Описание карточки
- `cartImg: string;` - Изображение корзины

Класс `HeaderModel` имплементирует интерфейс `IHeaderModel`

```ts
export interface IHeaderModel {
	logoImg: string;
	logoLink: string;
	cartImg: string;
}
```

### `HeaderView`

Класс `HeaderView` нужен для того, чтобы отображать шапку сайта

#### `constructor`

Принимает шапку сайта и количестов товаров в корзине

```ts
constructor(HeaderModel: IHeaderModel, cardsCount: number)
```

Класс IHeaderView содержит методы для работы с шапкой:

- `render(data: { logoImg: string; logoLink: string; cartImg: string },cardsCount: number): void` - Метод принимает обект шапки и выводит её, а также количестов карт в корзине и выводит это число на элемент корзины.
- `setOnCartClick(handler: () => void): void` - Метод, суть которого повесить слушатель клика но элемет корзины

Класс `HeaderView` имплементирует интерфейс `IHeaderView`

```ts
export interface IHeaderView {
	render(
		data: { logoImg: string; logoLink: string; cartImg: string },
		cardsCount: number
	): void;
	setOnCartClick(handler: () => void): void;
}
```

### `HeaderPresenter`

Класс `HeaderPresenter` нужен для того, чтобы соединить можель и ототбрпажение шапки сайта

Класс `HeaderPresenter` хранит методы для роботы с моделью и отображением шапки сайте

- `init(): void`
- `cartHandleClick(): void` - Метод клика по корзине

Класс `HeaderPresenter` имплементирует интерфейс `IHeaderPresenter`

```ts
export interface IHeaderPresenter {
	init(): void;
	cartHandleClick(): void;
}
```

### `CardModel`

Класс `CardModel` нужен для того, чтобы хранить информацию о карте товара, добавлять или удалять ее из корзины, получать ее данные

#### `constructor`

Принимает данные кары

```ts
constructor(cardName: string, cardDescription: string, cardImage: string, cardTag: TCategory)
```

##### Тип `TCategory` - содержит в себе все возможные теги карты:

```ts
export type TCategory =
	| 'софт-скил'
	| 'хард-скил'
	| 'кнопка'
	| 'другое'
	| 'дополнительное';
```

Класс `CardModel` содержит данные карты:

- `id: string;`
- `image: string;`
- `price: string;`
- `cardName: string;`
- `description: string;`
- `category: TCategory;`

и методы для работы с картой:

- `addToCart(id: string): void` - Метод добавления карты в корзину
- `removeFromCart(id: number): void` - Метод удаления карты из корзины
- `getCard(): ICardModel` Метод получения данных карты

Класс `CardModel` имплементирует интерфейс `ICardModel`

```ts
export interface ICardModel {
	id: string;
	image: string;
	price: string;
	cardName: string;
	description: string;
	category: TCategory;

	addToCart(product: ICardModel): void;
	removeFromCart(id: number): void;
	getCard(): ICardModel;
}
```

### `CardMainView`

Класс `CardMainView` нужен для того, чтобы отображать главную версию карты и вешать на нее слушатель события

#### `constructor`

Принимает контейнер

```ts
constructor(container: HTMLElement)
```

Класс `CardMainView` содержит методы для работы с картой:

- `render(): void` - Метод вывода карты
- `onClick(): void` - Метод клика по карте

Класс `CardMainView` имплементирует интерфейс `ICardMainView`

```ts
export interface ICardMainView {
	render(): void;
	onClick(handler: (id: string) => void): void;
}
```

### `CardModalView`

Класс `CardModalView` нужен для того, чтобы отображать карту в виде модального окна и вешать на нее слушатель события

#### `constructor`

Принимает данные карты

```ts
constructor(container: HTMLElement)
```

Класс CardModalView содержит методы для работы с картой:

- `render(): void` - Метод отображения карты
- `onClick(handler: (id: string) => void): void` - Метод клика для добавления карты в корзину

Класс CardMainView имплементирует интерфейс ICardModalView, который в свою очередь имплементирует IModalView(Рассмотрен отдельно)

```ts
export interface ICardModalView extends IModalData {
	render(): void;
	onClick(handler: (id: string) => void): void;
}
```

### `CardSmallView`

Класс `CardSmallView` нужен для того, чтобы отображать карту маленького вида и вешать на нее слушатель события

#### `constructor`

Примет данные карты

```ts
constructor(container: HTMLElement)
```

Класс CardSmallView содержит методы для работы с картой:

- `render(): void` - Метод отображения карты
- `onRemove(handler: (id: string) => void): void` - Метод слушаетля удаления карты

Класс `CardSmallView` имплементирует интерфейс `ICardSmallView`

```ts
export interface ICardSmallView {
	render(): void;
	onRemove(handler: (id: string) => void): void;
}
```

<!--






















 -->

### `CardCollectionModel`

Класс `CardCollectionModel` нужен для того, хранить все карточки и отдавать или принимать их

#### `constructor`

Принимает данные карточек

```ts
constructor(cards CardModel[])
```

Класс CardCollectionModel содержит данные карточек:

- `cards: ICardModel[]` - Массив карточек

и методы для работы с карточками:

- `setCards(cards: ICardModel[]): void` - Метод для передачи нового масива карточек
- `getCards(): ICardModel[]` - Метод для получения актуального массива карточек

Класс `CardCollectionModel` имплементирует интерфейс `ICardCollectionModel`

```ts
export interface ICardCollectionModel {
	cards: ICard[];

	setCards(cards: ICard[]): void;
	getCards(): ICard[];
}
```

### `CardCollectionView`

Класс `CardCollectionView` нужен для того, чтобы отображать коллекцию карточек на главной странице

Класс `CardCollectionView` содержит метод для рендера карточек:

- `render(cards: ICardModel[]): void`

Имплементирует интерфейс `ICardCollectionView`

```ts
export interface ICardCollectionView {
	render(cards: ICardModel[]): void;
}
```

### `OrderModel`

Класс `OrderModel` хранит все данные нужные для оформления заказа, написан как `Bulder` и имеет методы для сбора этих данных поэтапно. Имеет соответствующие рерулярки для пороврки и методы валидации и сброса.

`construnctor` принимает список карт:

```ts
constructor(cards: ICardModel[])
```

свойсвта класса:

- `cards: ICardModel[]`
- `data: Partial<IOrderModel>` - Некоторое колличетво данных заказа, для того чтобы можно было добавлять постепенно
- `userMail: string`
- `userMailRegExp: RegExp` - Регулярка Почты
- `userPhone: string`
- `userPhoneRegExp: RegExp` - Регулярка Номера телефона
- `userAddress: string`
- `payMethod: TPayMethod` - тип оплаты

##### Тип `TPayMethod` типизирует варианты оплаты

```ts
export type TPayMethod = 'cash' | 'non-cash';
```

методы класса:

- `updateField<T extends keyof IOrderModel>(key: T, value: IOrderModel[T]):-void`
- `isValid(): boolean`
- `getData(): Partial<IOrderModel>`
- `isComplete(): boolean`
- `reset(): void`

Класс имплементирует интерфейс `IOrderModel`

```ts
export interface IOrderModel {
	cards: ICardModel[];
	data: Partial<IOrderModel>;
	userMail: string;
	userMailRegExp: RegExp;
	userPhone: string;
	userPhoneRegExp: RegExp;
	userAddress: string;
	payMethod: TPayMethod;
	// TODO: Переделать доку
	addCard(): void;
	updateField<T extends keyof IOrderModel>(key: T, value: IOrderModel[T]): void;
	isValid(): boolean;
	getData(): Partial<IOrderModel>;
	isComplete(): boolean;
	reset(): void;
}
```

Классы `IOrderStepOneView`, `IOrderStepTwoView`, `IOrderStepTwoView` расширены классом `IModalView` и нужны для отображения всех этапов оформления заказа.

Они хранят элементы, нужные для взаимодействия:

- `payMethodOnlineButton: HTMLButtonElement`
- `payMethodCashButton: HTMLButtonElement`
- `userAddressInput: HTMLInputElement`
- `userMailInput: HTMLInputElement`
- `OrderStepOneSubmit: HTMLButtonElement`
- `OrderStepTwoSubmit: HTMLButtonElement`
- `OrderStepThreeSubmit: HTMLButtonElement`

И методы отвечающие за добавление слушателей нажатия на Submit:

- `	onSubmit(handler: () => void): void`

И за вывод:

- `	render(): void`

Все они имплементируют соответсвующие интерфейсы:

```ts
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
```

Класс `IOrderPresenter` - нужен для того, чтобы соеденить модель заказа с разными его этапами. Умеет отправлять данные заказа и соединять эти компоненты

хранит соответсвующие методы:

- `getDataStepOne(): { address: string; payMethod: TPayMethod }`
- `getDataStepTwo(): { email: string; phone: string }`
- `init(): void`

Имплементирует интерфейс `IOrderPresenter`:

```ts
export interface IOrderPresenter {
	getDataStepOne(): { address: string; payMethod: TPayMethod };
	getDataStepTwo(): { email: string; phone: string };
	init(): void;
}
```

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

#### `CartModel`

Класс "Cart" хранит карты добавленные в корзину, их цены и умеет считать финальную стоимость, принимать ее, если потребуется. Умеет принимать и отдавать карты в корзине и обнулять их список

`constructor` принимает карты добавленные в корзину:

```ts
constructor(cardsinCart: ICardModel[])
```

Свойства класса:

- `totalPrice: number`
- `cardsInCart: ICardModel[]`

Методы:

- `getTotalPrice(): number`
- `setTotalPrice(): void`
- `getCards(): ICardModel[]`
- `setCards(): ICardModel[]`
- `reset(): void`

Имплементирует интерфейс `ICartModel`:

```ts
export interface ICartModel {
	totalPrice: number;
	cardsInCart: ICardModel[];
	getTotalPrice(): number;
	setTotalPrice(): void;
	getCards(): ICardModel[];
	setCards(): ICardModel[];
	reset(): void;
}
```

#### `CartView`

Класс "CartView" - отображает корзину вещает на нее слушатель события `submit`

Методы:

```ts
	onSubmit(handler: () => void): void;
	render(data: { cards: ICardModel[]; totalPrice: number }): void;
```

Имплементирует интерфейс `ICartView` расширенный от `IModalData`:

```ts
export interface ICartView extends IModalData {
	onSubmit(handler: () => void): void;
	render(data: { cards: ICardModel[]; totalPrice: number }): void;
}
```

#### `CartPresenter`

Класс "CartPresenter" - нужен для связи модели и отображения корзины. он умеет рендерить корзину.

Методы:

- `renderOrderStepOne(): void`
- `init(): void`

Имплементирует интерфейс `ICartPresenter`:

```ts
export interface ICartPresenter {
	renderOrderStepOne(): void;
	init(): void;
}
```
