import { Order } from '../order';

export class OrderUpdated {
	public readonly date = new Date();

	constructor(public readonly order: Order) {}
}
