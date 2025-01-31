import { Order } from '../order';

export class OrderUpdated {
	public readonly type = 'order.updated';
	public readonly date = new Date();

	constructor(public readonly order: Order) {}
}
