import { Component } from './base/Component';

export interface HeaderData {
	logo: string;
}

export class HeaderModel implements HeaderData {
	constructor(public logo: string) {
		this.logo = logo;
	}
}

// TODO: Доделать
// export class HeaderView extends Component<HTMLElement> {
// 	constructor(protected container: HTMLElement, model: HeaderModel) {
// 		super(container);
// 		this.logo = logo;
// 	}

//     render(data?: Partial<HTMLElement>): HTMLElement {
//         const
//     }
// }
