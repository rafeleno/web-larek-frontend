import { IModalData } from '../components/common/modal';

export interface IModal {
	open(): void;
	close(): void;
	render(data: IModalData): HTMLElement;
	content: HTMLElement | null;
}
