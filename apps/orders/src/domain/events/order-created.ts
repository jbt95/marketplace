import { Order } from '../order';

export class OrderCreated {
	public readonly type = 'order.created';
	public readonly date = new Date();

	constructor(public readonly order: Order) {}
}
