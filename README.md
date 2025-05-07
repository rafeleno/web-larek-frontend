# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:

- `src/` — исходные файлы проекта
- `src/components/` — папка с компонентами
- `src/components/base/` — базовые классы и утилиты
- `src/types/` — типы данных
- `src/utils/` — вспомогательные функции и константы

Важные файлы:

- `src/pages/index.html` — HTML-файл главной страницы
- `src/types/index.ts` — файл с типами
- `src/index.ts` — точка входа приложения
- `src/scss/styles.scss` — корневой файл стилей
- `src/utils/constants.ts` — файл с константами
- `src/utils/utils.ts` — файл с утилитами

## Установка и запуск

Для установки и запуска проекта выполните команды:

```bash
npm install
npm run start
```

или

```bash
yarn
yarn start
```

## Сборка

```bash
npm run build
```

или

```bash
yarn build
```

---

## Классы и компоненты

### `Modal`

Класс `Modal` отвечает за управление модальными окнами. Он предоставляет базовый функционал для открытия, закрытия и отображения контента.

#### Поля:

- `container: HTMLElement` — корневой HTML-элемент модального окна.
- `events: IEvents` — объект для отправки/получения событий.
- `_closeButton: HTMLButtonElement` — кнопка закрытия.
- `_content: HTMLElement` — область для динамического контента.

#### Методы:

```typescript
set content(value: HTMLElement): void;
```

Устанавливает содержимое модального окна.

```typescript
open(): void;
```

Открывает модальное окно и добавляет обработчик для закрытия по клавише `Escape`.

```typescript
close(): void;
```

Закрывает модальное окно, очищает содержимое и удаляет обработчик клавиши `Escape`.

```typescript
render(data: IModalData): HTMLElement;
```

Отображает переданный контент в модальном окне.

#### Пример кода:

```typescript
export class Modal extends Component<IModalData> {
	protected _closeButton: HTMLButtonElement;
	protected _content: HTMLElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this._closeButton = ensureElement<HTMLButtonElement>(
			'.modal__close',
			container
		);
		this._content = ensureElement<HTMLElement>('.modal__content', container);

		this._closeButton.addEventListener('click', () => this.close());
		this.container.addEventListener('click', () => this.close());
		this._content.addEventListener('click', (event) => event.stopPropagation());
	}

	set content(value: HTMLElement) {
		this._content.replaceChildren(value);
	}

	open() {
		this.container.classList.add('modal_active');
		this.events.emit('modal:open');
		window.addEventListener('keydown', this.escCloser);
	}

	escCloser = (e: KeyboardEvent) => {
		if (e.key === 'Escape') {
			e.preventDefault();
			this.close();
		}
	};

	close() {
		this.container.classList.remove('modal_active');
		this.content = null;
		this.events.emit('modal:close');
		window.removeEventListener('keydown', this.escCloser);
	}

	render(data: IModalData): HTMLElement {
		super.render(data);
		this.open();
		return this.container;
	}
}
```

---

### `Card`

Класс `Card` представляет карточку товара. Он содержит данные о товаре и методы для работы с ними.

#### Поля:

- `_id: string` — уникальный идентификатор карточки.
- `_image: string` — URL изображения товара.
- `_price: number` — цена товара.
- `_title: string` — название товара.
- `_description: string` — описание товара.
- `_category: TCategory` — категория товара.
- `_isInCartState: boolean` — состояние, указывающее, находится ли товар в корзине.

#### Методы:

```typescript
get cardData(): ICardData;
```

Возвращает объект с данными карточки.

```typescript
isInCart(cardsInCart: ICardData[]): void;
```

Проверяет, находится ли карточка в корзине, и обновляет состояние `_isInCartState`.

#### Пример кода:

```typescript
export class Card {
	protected _isInCartState = false;

	constructor(
		protected _id: string,
		protected _image: string,
		protected _price: number,
		protected _title: string,
		protected _description: string,
		protected _category: TCategory
	) {}

	get cardData(): ICardData {
		return {
			id: this._id,
			image: this._image,
			price: this._price,
			title: this._title,
			description: this._description,
			category: this._category,
			isInCartState: this._isInCartState,
		};
	}

	isInCart(cardsInCart: ICardData[]): void {
		this._isInCartState = cardsInCart.some((card) => card.id === this._id);
	}
}
```

---

### `CartModel`

Класс `CartModel` отвечает за управление корзиной. Он хранит список товаров, добавленных в корзину, и предоставляет методы для работы с ними.

#### Поля:

- `_cards: ICardData[]` — массив товаров в корзине.
- `_cartEmptyStatus: boolean` — состояние корзины (пустая/непустая).

#### Методы:

```typescript
addCards(newCard: ICardData): void;
```

Добавляет товар в корзину, если его там еще нет.

```typescript
removeCards(id: Id): void;
```

Удаляет товар из корзины по его идентификатору.

```typescript
checkCartIsEmpty(): void;
```

Проверяет, пуста ли корзина.

```typescript
reset(): void;
```

Очищает корзину.

#### Пример кода:

```typescript
export class CartModel {
	protected _cards: ICardData[] = [];
	protected _cartEmptyStatus: boolean;

	addCards(newCard: ICardData): void {
		if (!this._cards.some((card) => card.id === newCard.id)) {
			this._cards.push(newCard);
		}
	}

	removeCards(id: Id): void {
		this._cards = this._cards.filter((item) => item.id !== id);
	}

	checkCartIsEmpty() {
		this._cartEmptyStatus = this._cards.length === 0;
	}

	reset() {
		this._cards = [];
	}
}
```

### `CardCollection`

Класс `CardCollectionModel` отвечает за управление коллекцией карточек. Он хранит массив карточек и предоставляет методы для работы с ними.

#### Поля:

- `_cards: Card[]` — массив карточек.

#### Методы:

```typescript
get cards(): Card[];
```

Возвращает массив карточек.

```typescript
set cards(newCards: Card[]): void;
```

Устанавливает новый массив карточек.

#### Пример кода:

```typescript
export class CardCollectionModel {
	constructor(protected _cards: Card[]) {}

	get cards(): Card[] {
		return this._cards;
	}

	set cards(newCards: Card[]) {
		this._cards = newCards;
	}
}
```

---

Класс `CardCollectionView` отвечает за отображение коллекции карточек на странице.

#### Поля:

- `container: HTMLElement` — контейнер для отображения карточек.
- `CardCollectionModel: CardCollectionModel` — модель коллекции карточек.
- `CDN_URL: string` — URL для загрузки изображений.
- `ViewClass: typeof CardView` — класс для отображения карточек.
- `events: IEvents` — объект для управления событиями.

#### Методы:

```typescript
render(): void;
```

Отображает карточки из коллекции.

#### Пример кода:

```typescript
export class CardCollectionView {
	constructor(
		private container: HTMLElement,
		private CardCollectionModel: CardCollectionModel,
		private CDN_URL: string,
		private ViewClass: typeof CardView,
		private events: IEvents
	) {}

	render() {
		this.CardCollectionModel.cards.forEach((card: Card) => {
			new this.ViewClass(
				this.container,
				card,
				this.CDN_URL,
				this.events
			).render();
		});
	}
}
```

---

### `Order`

Класс `OrderModel` управляет данными заказа, включая валидацию и отправку данных на сервер.

#### Поля:

- `_payment: TPayMethod` — способ оплаты.
- `_email: string` — email пользователя.
- `_phone: string` — телефон пользователя.
- `_address: string` — адрес доставки.
- `_items: ICardData[]` — список товаров в заказе.

#### Методы:

```typescript
stepOneIsValid(modal: OrderStepOneModal): void;
```

Проверяет валидность данных на первом шаге оформления заказа.

```typescript
stepTwoIsValid(): void;
```

Проверяет валидность данных на втором шаге оформления заказа.

```typescript
post(): Promise<OrderData>;
```

Отправляет данные заказа на сервер.

#### Пример кода:

```typescript
export class OrderModel {
	protected _payment: TPayMethod = 'empty';
	protected _email = '';
	protected _phone = '';
	protected _address = '';
	protected _items: ICardData[] = [];

	stepOneIsValid(modal: OrderStepOneModal): void {
		if (
			!modal.buttonCash.classList.contains('button_alt-active') &&
			!modal.buttonCard.classList.contains('button_alt-active')
		) {
			throw new Error('Выберите метод оплаты');
		} else if (modal.addressInput.value.length < 1) {
			throw new Error('Введите адрес');
		}
	}

	async post(): Promise<OrderData> {
		const response = await this.api.post('/order', this.postData);
		return response as OrderData;
	}
}
```

---

Классы `OrderStepOneModal`, `OrderStepTwoModal`, `OrderStepThreeModal` отвечают за отображение шагов оформления заказа.

#### Поля:

- `formContent: HTMLElement` — содержимое формы.
- `buttonCard: HTMLButtonElement` — кнопка выбора оплаты картой.
- `buttonCash: HTMLButtonElement` — кнопка выбора оплаты наличными.
- `addressInput: HTMLInputElement` — поле ввода адреса.
- `formButton: HTMLButtonElement` — кнопка отправки формы.

#### Методы:

```typescript
render(data: IModalData): HTMLElement;
```

Отображает содержимое модального окна.

```typescript
reset(): void;
```

Сбрасывает состояние формы.

#### Пример кода:

```typescript
export class OrderStepOneModal extends Modal {
	formContent: HTMLElement;
	buttonCard: HTMLButtonElement;
	buttonCash: HTMLButtonElement;
	addressInput: HTMLInputElement;
	formButton: HTMLButtonElement;

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
	}

	render(data: IModalData = {}): HTMLElement {
		data.content = this.formContent;
		return super.render(data);
	}
}
```

---

### `Cart`

Класс `CartModel` управляет данными корзины, включая добавление, удаление и сброс товаров.

#### Поля:

- `_cards: ICardData[]` — массив товаров в корзине.
- `_cartEmptyStatus: boolean` — состояние корзины (пустая/непустая).

#### Методы:

```typescript
addCards(newCard: ICardData): void;
```

Добавляет товар в корзину.

```typescript
removeCards(id: Id): void;
```

Удаляет товар из корзины.

```typescript
reset(): void;
```

Очищает корзину.

#### Пример кода:

```typescript
export class CartModel {
	protected _cards: ICardData[] = [];
	protected _cartEmptyStatus: boolean;

	addCards(newCard: ICardData): void {
		if (!this._cards.some((card) => card.id === newCard.id)) {
			this._cards.push(newCard);
		}
	}

	removeCards(id: Id): void {
		this._cards = this._cards.filter((item) => item.id !== id);
	}

	reset() {
		this._cards = [];
	}
}
```

---

Класс `CartView` отвечает за отображение корзины.

#### Поля:

- `contentElement: HTMLElement` — содержимое корзины.
- `basketList: HTMLElement` — список товаров в корзине.
- `basketButton: HTMLButtonElement` — кнопка оформления заказа.

#### Методы:

```typescript
render(data: IModalData): HTMLElement;
```

Отображает содержимое корзины.

```typescript
updateCards(): void;
```

Обновляет список товаров в корзине.

#### Пример кода:

```typescript
export class CartView extends Modal {
	contentElement: HTMLElement;
	basketList: HTMLElement;
	basketButton: HTMLButtonElement;

	constructor(
		protected container: HTMLElement,
		private _model: CartModel,
		protected events: IEvents
	) {
		super(container, events);

		this.contentElement = ensureElement<HTMLTemplateElement>(
			'#basket'
		).content.firstElementChild?.cloneNode(true) as HTMLElement;
		this.basketList = ensureElement<HTMLTemplateElement>(
			'.basket__list',
			this.contentElement
		) as HTMLElement;
		this.basketButton = ensureElement<HTMLButtonElement>(
			'.basket__button',
			this.contentElement
		);
	}

	render(data: IModalData = {}): HTMLElement {
		this.renderCards(this._model.cards);
		data.content = this.contentElement;
		return super.render(data);
	}
}
```

---

### `Header`

Класс `HeaderModel` управляет данными шапки сайта, включая количество товаров в корзине.

#### Поля:

- `_productsCount: string` — количество товаров в корзине.

#### Методы:

```typescript
updateCounter(): string;
```

Обновляет количество товаров в корзине.

#### Пример кода:

```typescript
export class HeaderModel {
	protected _productsCount: string;

	constructor(protected cartModel: CartModel) {
		this._productsCount = '0';
	}

	updateCounter(): string {
		this._productsCount = this.cartModel.cards.length.toString();
		return this._productsCount;
	}
}
```

---

Класс `HeaderView` отвечает за отображение шапки сайта.

#### Поля:

- `counter: HTMLElement` — элемент для отображения количества товаров.
- `cart: HTMLElement` — элемент корзины.

#### Методы:

```typescript
render(): HTMLElement;
```

Отображает шапку сайта.

```typescript
updateCounter(): void;
```

Обновляет количество товаров в корзине.

#### Пример кода:

```typescript
export class HeaderView {
	counter: HTMLElement;
	cart: HTMLElement;

	constructor(
		protected container: HTMLElement,
		protected model: HeaderModel,
		protected events: IEvents
	) {
		this.counter = ensureElement<HTMLTemplateElement>(
			'.header__basket-counter',
			this.content
		);
		this.cart = ensureElement<HTMLElement>('.header__basket', this.content);
	}

	render(): HTMLElement {
		this.cart.addEventListener('click', () => this.events.emit('cart:click'));
		this.container.append(this.content);
		return this.container;
	}

	updateCounter(): void {
		this.counter.textContent = this.model.updateCounter();
	}
}
```

---

### `Component`

Класс `Component` является базовым для всех компонентов. Он предоставляет методы для работы с DOM.

#### Методы:

```typescript
toggleClass(element: HTMLElement, className: string, force?: boolean): void;
```

Переключает класс у элемента.

```typescript
setText(element: HTMLElement, value: unknown): void;
```

Устанавливает текстовое содержимое элемента.

```typescript
setDisabled(element: HTMLElement, state: boolean): void;
```

Устанавливает состояние блокировки элемента.

```typescript
render(data?: Partial<T>): HTMLElement;
```

Возвращает корневой DOM-элемент.

#### Пример кода:

```typescript
export abstract class Component<T> {
	protected constructor(protected readonly container: HTMLElement) {}

	toggleClass(element: HTMLElement, className: string, force?: boolean) {
		element.classList.toggle(className, force);
	}

	setText(element: HTMLElement, value: unknown) {
		if (element) {
			element.textContent = String(value);
		}
	}

	render(data?: Partial<T>): HTMLElement {
		Object.assign(this as object, data ?? {});
		return this.container;
	}
}
```
