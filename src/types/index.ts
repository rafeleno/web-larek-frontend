export interface ICard {
	_id: string;
	name: string;
	description: string;
	imageLink: string;
	LotStatus: TLotStatus;
	button: void;
}

export type TLotStatus = {
	text: `${'Открыто' | 'Откроется' | 'Закрыто'} до ${string}`;
	color: 'xxx' | 'xxx' | 'xxx';
};

export interface ICardContainer {
	loaCards(cards: ICard[]): void;
}

export interface IInfoBlock {
	imgLink?: null | string;
	title: string;
	text: string;
}

export type TBucketLot = Pick<ICard, 'name' | 'imageLink'> & {
	price: string;
	myBet: TMyBet;
	checkBox: HTMLInputElement;
};

export type TMyBet = {
	text: 'Моя Ставка';
	color: '#7CC37F';
};

export interface IBucket {
	handleActive: void;
	handleClosed: void;
	addlots(lots: TBucketLot[]): void;
}

export type TBucketButton = {
	handleClick: void;
};

export interface IHeader {
	logo: HTMLLinkElement;
	buttons: HTMLUListElement;
	bucketButton: TBucketButton;
}
