import { Order } from '../order';

export class OrderShipped {
	public readonly type = 'order.shipped';
	public readonly date = new Date();

	constructor(public readonly order: Order) {}
}
