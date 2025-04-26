export interface IHeaderModel {
	logoImg: string;
	logoLink: string;
	cartImg: string;
}

export interface IHeaderView {
	render(
		data: { logoImg: string; logoLink: string; cartImg: string },
		cardsCount?: number
	): void;
	setOnCartClick(handler: () => void): void;
}

export interface IHeaderPresenter {
	init(): void;
	cartHandleClick(): void;
}
